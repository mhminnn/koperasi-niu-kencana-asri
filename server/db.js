const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize database file
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys & WAL mode for speed
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize schema tables
function initDb() {
  // Admin Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    );
  `);

  // Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Umum',
      price REAL DEFAULT 0,
      image_url TEXT,
      badge TEXT DEFAULT 'Unggulan',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec(`ALTER TABLE products ADD COLUMN is_featured INTEGER DEFAULT 0;`);
  } catch (e) {
    // Column already exists
  }

  // News Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'Berita',
      image_url TEXT,
      images TEXT,
      date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec(`ALTER TABLE news ADD COLUMN images TEXT;`);
  } catch (e) {
    // Column already exists
  }

  // Partners (Logo Kolaborasi) Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT NOT NULL,
      website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Messages Table (Kontak Form)
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Socials Table (Media Sosial Official)
  db.exec(`
    CREATE TABLE IF NOT EXISTS socials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      name TEXT NOT NULL,
      handle TEXT,
      description TEXT,
      url TEXT NOT NULL,
      cover_color TEXT DEFAULT 'from-slate-900 to-slate-950',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Settings Table (API Keys & Config)
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Seed default Gemini API Key if empty
  const existingKey = db.prepare("SELECT value FROM settings WHERE key = 'gemini_api_key'").get();
  if (!existingKey) {
    db.prepare("INSERT INTO settings (key, value) VALUES ('gemini_api_key', ?)").run(
      process.env.GEMINI_API_KEY || ''
    );
  }

  // Seed default admin if empty
  const adminCount = db.prepare('SELECT COUNT(*) AS count FROM admin').get();
  if (adminCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admin (username, password, name) VALUES (?, ?, ?)').run(
      'admin',
      hashedPassword,
      'Administrator Niu Kencana'
    );
    console.log('✅ Default admin created: username: admin, password: admin123');
  }

  // Seed sample products if empty
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (name, description, category, price, image_url, badge, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    insertProduct.run(
      'Minyak Kelapa Murni (VCO) Premium',
      'Minyak kelapa murni diekstrak dari kelapa segar pilihan khas Parigi Moutong dengan metode cold-pressed.',
      'Olahan Kelapa',
      85000,
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80',
      'Terlaris'
    );

    insertProduct.run(
      'Gula Kelapa Organik (Coconut Sugar)',
      'Gula merah kelapa berbentuk kristal organik berkualitas ekspor tanpa bahan pengawet.',
      'Bumbu & Pemanis',
      45000,
      'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80',
      'Unggulan'
    );

    insertProduct.run(
      'Briket Arang Batok Kelapa',
      'Briket arang kualitas tinggi dengan daya bakar tinggi dan minim asap untuk keperluan sisha dan BBQ.',
      'Energi Terbarukan',
      35000,
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      'Ekspor'
    );

    console.log('✅ Sample products seeded');
  } else {
    // Ensure at least top 3 products are featured if none set yet
    const featuredCount = db.prepare('SELECT COUNT(*) AS count FROM products WHERE is_featured = 1').get();
    if (featuredCount.count === 0) {
      db.prepare('UPDATE products SET is_featured = 1 WHERE id IN (SELECT id FROM products ORDER BY id ASC LIMIT 3)').run();
    }
  }

  // Seed sample news if empty
  const newsCount = db.prepare('SELECT COUNT(*) AS count FROM news').get();
  if (newsCount.count === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news (title, excerpt, content, category, image_url, images, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const news1Images = JSON.stringify([
      '/about-team.jpg',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ]);

    insertNews.run(
      'Koperasi Niu Kencana Asri Memperluas Kemitraan Perhutanan Sosial',
      'Penandatanganan nota kesepahaman antara Koperasi Niu Kencana Asri dan kelompok tani Parigi Moutong.',
      'Koperasi Niu Kencana Asri berkomitmen memperkuat ekonomi sirkular dan tata kelola inklusif dengan memperluas perhutanan sosial berkelanjutan di Sulawesi Tengah.',
      'Kemitraan',
      '/about-team.jpg',
      news1Images,
      '2026-09-10'
    );

    const news2Images = JSON.stringify([
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      '/about-team.jpg',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'
    ]);

    insertNews.run(
      'Pelatihan Pengolahan Produk Kelapa Modern Untuk Petani Lokal',
      'Meningkatkan nilai tambah produk kelapa melalui teknologi ramah lingkungan.',
      'Program edukasi dan transfer teknologi pengolahan VCO & briket arang batok kelapa bagi masyarakat desa Sidoan.',
      'Pelatihan',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      news2Images,
      '2026-08-25'
    );

    console.log('✅ Sample news seeded');
  }

  // Seed sample partner logos if empty
  const partnerCount = db.prepare('SELECT COUNT(*) AS count FROM partners').get();
  if (partnerCount.count === 0) {
    const insertPartner = db.prepare(`
      INSERT INTO partners (name, logo_url, website)
      VALUES (?, ?, ?)
    `);

    insertPartner.run('Kementerian LHK', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo_Kementerian_Lingkungan_Hidup_dan_Kehutanan.png', 'https://menlhk.go.id');
    insertPartner.run('Pemkab Parigi Moutong', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Lambang_Kabupaten_Parigi_Moutong.png/488px-Lambang_Kabupaten_Parigi_Moutong.png', 'https://parigimoutongkab.go.id');
    insertPartner.run('Dinas Koperasi & UMKM', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Logo_Koperasi_Indonesia_%282015%29.svg', '#');

    console.log('✅ Sample partner logos seeded');
  }

  // Seed sample social media if empty
  const socialCount = db.prepare('SELECT COUNT(*) AS count FROM socials').get();
  if (socialCount.count === 0) {
    const insertSocial = db.prepare(`
      INSERT INTO socials (platform, name, handle, description, url, cover_color)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertSocial.run(
      'Instagram',
      'Koperasi Niu Kencana',
      '@niukencanaasri',
      'Dokumentasi kegiatan lapangan, olahan VCO, briket kelapa, dan cerita pemberdayaan petani Sidoan.',
      'https://www.instagram.com/',
      'from-purple-600 via-pink-500 to-amber-500'
    );

    insertSocial.run(
      'Facebook',
      'Koperasi Niu Kencana Asri',
      'Halaman Facebook Resmi',
      'Kabar terkini seputar rapat anggota koperasi, pengumuman program perhutanan sosial, dan kemitraan.',
      'https://www.facebook.com/',
      'from-blue-700 via-blue-600 to-indigo-800'
    );

    insertSocial.run(
      'YouTube',
      'Niu Kencana Channel',
      'Video Dokumenter',
      'Tonton liputan video pembuatan VCO, pengolahan briket arang batok kelapa, dan profil petani hutan.',
      'https://www.youtube.com/',
      'from-red-600 via-rose-600 to-red-800'
    );

    insertSocial.run(
      'WhatsApp',
      'WhatsApp Resmi CS',
      '0853-9547-7026',
      'Hubungi langsung Sekretariat Koperasi untuk konsultasi kemitraan, grosir produk, atau pertanyaan umum.',
      'https://api.whatsapp.com/send?phone=6285395477026',
      'from-emerald-600 via-teal-600 to-emerald-800'
    );

    insertSocial.run(
      'TikTok',
      '@niukencana.official',
      'Konten Edukasi & Kreatif',
      'Video singkat seputar manfaat VCO, cara membedakan briket berkualitas, dan cerita keseharian petani.',
      'https://www.tiktok.com/',
      'from-slate-900 via-black to-slate-950'
    );

    console.log('✅ Sample social media seeded');
  }
}

initDb();

module.exports = db;
