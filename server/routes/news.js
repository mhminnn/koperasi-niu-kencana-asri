const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { verifyAdminToken } = require('./auth');

// Setup multer image storage for news
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'news-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
const newsUpload = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'image', maxCount: 1 }
]);

// GET /api/news - Get all news
router.get('/', (req, res) => {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY id DESC').all();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/news/:id - Get single news
router.get('/:id', (req, res) => {
  try {
    const newsItem = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!newsItem) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/news - Create news item (Admin only, up to 5 images)
router.post('/', verifyAdminToken, newsUpload, (req, res) => {
  try {
    const { title, excerpt, content, category, date } = req.body;
    let image_list = [];

    // Check uploaded files
    if (req.files && req.files.images && req.files.images.length > 0) {
      image_list = req.files.images.map(f => `/uploads/${f.filename}`);
    } else if (req.files && req.files.image && req.files.image.length > 0) {
      image_list = [`/uploads/${req.files.image[0].filename}`];
    }

    // Check JSON or URL list from body
    if (req.body.image_urls) {
      try {
        const parsed = typeof req.body.image_urls === 'string' ? JSON.parse(req.body.image_urls) : req.body.image_urls;
        if (Array.isArray(parsed)) {
          image_list = [...image_list, ...parsed].filter(Boolean).slice(0, 5);
        }
      } catch (e) {
        if (typeof req.body.image_urls === 'string') image_list.push(req.body.image_urls);
      }
    }

    if (image_list.length === 0 && req.body.image_url) {
      image_list.push(req.body.image_url);
    }

    const main_image = image_list[0] || '';
    const images_json = JSON.stringify(image_list);

    if (!title || !content) {
      return res.status(400).json({ error: 'Judul dan konten berita wajib diisi' });
    }

    const newsDate = date || new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO news (title, excerpt, content, category, image_url, images, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      excerpt || title.substring(0, 100) + '...',
      content,
      category || 'Berita',
      main_image,
      images_json,
      newsDate
    );

    const newNews = db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Berita berhasil ditambahkan', news: newNews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/news/:id - Update news item (Admin only, up to 5 images)
router.put('/:id', verifyAdminToken, newsUpload, (req, res) => {
  try {
    const { title, excerpt, content, category, date } = req.body;
    const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }

    let image_list = [];

    // Check uploaded files
    if (req.files && req.files.images && req.files.images.length > 0) {
      image_list = req.files.images.map(f => `/uploads/${f.filename}`);
    } else if (req.files && req.files.image && req.files.image.length > 0) {
      image_list = [`/uploads/${req.files.image[0].filename}`];
    }

    // Check JSON or URL list from body
    if (req.body.image_urls) {
      try {
        const parsed = typeof req.body.image_urls === 'string' ? JSON.parse(req.body.image_urls) : req.body.image_urls;
        if (Array.isArray(parsed)) {
          image_list = [...image_list, ...parsed].filter(Boolean).slice(0, 5);
        }
      } catch (e) {
        if (typeof req.body.image_urls === 'string') image_list.push(req.body.image_urls);
      }
    }

    if (image_list.length === 0 && req.body.image_url) {
      image_list.push(req.body.image_url);
    }

    // Fallback to existing images if none provided
    if (image_list.length === 0) {
      try {
        image_list = existing.images ? JSON.parse(existing.images) : [existing.image_url].filter(Boolean);
      } catch (e) {
        image_list = [existing.image_url].filter(Boolean);
      }
    }

    const main_image = image_list[0] || existing.image_url || '';
    const images_json = JSON.stringify(image_list);

    const stmt = db.prepare(`
      UPDATE news 
      SET title = ?, excerpt = ?, content = ?, category = ?, image_url = ?, images = ?, date = ?
      WHERE id = ?
    `);

    stmt.run(
      title || existing.title,
      excerpt !== undefined ? excerpt : existing.excerpt,
      content || existing.content,
      category || existing.category,
      main_image,
      images_json,
      date || existing.date,
      req.params.id
    );

    const updatedNews = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    res.json({ message: 'Berita berhasil diperbarui', news: updatedNews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const fs = require('fs');

function deleteUploadedFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  if (fileUrl.startsWith('/uploads/')) {
    const filename = path.basename(fileUrl);
    const filepath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (e) {
        console.error('Failed deleting physical file:', filepath, e);
      }
    }
  }
}

// DELETE /api/news/:id - Delete news item (Admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }

    if (existing.image_url) {
      deleteUploadedFile(existing.image_url);
    }
    if (existing.images) {
      try {
        const parsed = JSON.parse(existing.images);
        if (Array.isArray(parsed)) {
          parsed.forEach(img => deleteUploadedFile(img));
        }
      } catch (e) {}
    }

    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
