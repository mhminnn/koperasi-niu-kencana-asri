import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShoppingBag, 
  Users, 
  Leaf, 
  ChevronRight,
  TrendingUp,
  Mail,
  Phone,
  MessageCircle,
  X,
  Send,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Contact Pop-up State
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [quickFormData, setQuickFormData] = useState({ name: '', contact: '', message: '' });
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setQuickSubmitting(true);
    setQuickSuccess(false);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quickFormData.name,
          email: quickFormData.contact,
          subject: 'Pesan Cepat Beranda',
          message: quickFormData.message
        })
      });

      if (res.ok) {
        setQuickSuccess(true);
        setQuickFormData({ name: '', contact: '', message: '' });
        setTimeout(() => setQuickSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuickSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, newsRes, partnerRes] = await Promise.all([
          fetch('/api/products').then(r => r.json()),
          fetch('/api/news').then(r => r.json()),
          fetch('/api/partners').then(r => r.json())
        ]);
        setProducts(Array.isArray(prodRes) ? prodRes : []);
        setNewsList(Array.isArray(newsRes) ? newsRes : []);
        setPartners(Array.isArray(partnerRes) ? partnerRes : []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20 font-sans text-slate-800 selection:bg-[#ff2be0] selection:text-white">
      
      {/* 1. HERO SECTION WITH SEAMLESS PINK BACKDROP GRADIENT */}
      <section className="relative -mt-20 pt-32 pb-24 overflow-hidden bg-gradient-to-b from-[#ffaee8] via-[#fc83df] via-45% to-[#fafafa]">
        
        {/* Glow backdrop element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[400px] bg-gradient-to-tr from-[#f42db7]/30 via-[#ff66e5]/25 to-purple-300/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-7">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/95 border border-pink-300 text-[#f42db7] text-xs sm:text-sm font-extrabold shadow-md tracking-tight backdrop-blur-md hover:scale-105 transition-transform duration-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f42db7] animate-ping shrink-0" />
            Koperasi Niu Kencana Asri
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08]">
            Sumber daya<br />
            berkelanjutan, masa depan<br />
            <span className="text-[#f42db7]">yang menjanjikan</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-semibold">
            Pengelolaan usaha inklusif dan sirkular yang memberdayakan perempuan dan penyandang disabilitas untuk Indonesia yang lebih hijau dan setara.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              to="/produk"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#18181b] hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Cari Produk
              <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/tentang-kami"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white/95 hover:bg-white text-slate-900 border border-slate-300/80 font-extrabold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Tentang Kami
            </Link>
          </div>

        </div>
      </section>

      {/* 2. SECTION: KOLABORASI & INKLUSIVITAS UNTUK MASA DEPAN HIJAU */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white p-6 sm:p-12 rounded-[2.5rem] border border-slate-200/80 shadow-sm">
          
          {/* Photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 group">
              <img
                src="/about-team.jpg"
                alt="Tim Anggota Koperasi Niu Kencana"
                className="w-full h-80 lg:h-[400px] object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Text Details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              NILAI UTAMA
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Kolaborasi & Inklusivitas untuk masa Depan Hijau
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Koperasi Niu Kencana Asri hadir untuk memperkuat ekosistem komoditas lokal dan perhutanan sosial. Kami melatih serta memfasilitasi petani lokal agar mampu memproduksi olahan kelapa berkualitas tinggi.
            </p>

            {/* Feature Item 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Users className="w-5 h-5 text-pink-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm">Pemberdayaan Masyarakat</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Meningkatkan kesejahteraan petani lokal melalui tata kelola yang inklusif.</p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Leaf className="w-5 h-5 text-pink-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm">Ekonomi Sirkular</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Meminimalkan limbah dengan mengolah seluruh komponen buah kelapa.</p>
              </div>
            </div>

            {/* Link Button */}
            <div className="pt-2">
              <Link
                to="/tentang-kami"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-800 hover:bg-pink-50 hover:text-[#ff2be0] text-xs font-bold transition border border-slate-200/80"
              >
                Pelajari Selengkapnya
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION: VISI & MISI + NEON PINK QUOTE BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Visi & Misi List */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                PROFIL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Visi & Misi
              </h2>

              <ol className="space-y-4 text-xs sm:text-sm text-slate-600 pt-2 list-decimal list-inside leading-relaxed font-medium">
                <li className="pl-1">
                  <span className="font-semibold text-slate-900">Memanfaatkan potensi kelapa parigi</span> secara optimal dan berdaya saing ekspor.
                </li>
                <li className="pl-1">
                  <span className="font-semibold text-slate-900">Memberdayakan kelompok tani lokal</span> melalui inovasi pengolahan produk ramah lingkungan.
                </li>
                <li className="pl-1">
                  <span className="font-semibold text-slate-900">Menjaga pelestarian hutan sosial</span> melalui penerapan praktik perhutanan sosial berkelanjutan.
                </li>
                <li className="pl-1">
                  <span className="font-semibold text-slate-900">Mendorong keterbukaan manajemen</span> dan pembagian hasil yang adil bagi seluruh anggota di Sidoan.
                </li>
              </ol>
            </div>
          </div>

          {/* Right Column: Pink Quote Banner (#fc83df theme matching Image 4) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#fc83df] via-[#f559d2] to-[#e421be] text-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl flex flex-col justify-center relative overflow-hidden">
            
            <div className="relative z-10 space-y-6">
              <p className="text-lg sm:text-2xl font-bold leading-relaxed tracking-tight font-serif italic">
                "Setiap tetes Minyak Kelapa Niu Kencana, setiap batang briket arang, dan setiap batok pupuk organik kami adalah bukti nyata pemberdayaan, keberlanjutan, dan pesona alam kita."
              </p>
              <div className="text-xs font-extrabold uppercase tracking-widest text-pink-100 pt-2">
                — Koperasi Niu Kencana Asri
              </div>
            </div>

            {/* Background Decorative Blur */}
            <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 4. SECTION: PRODUK UNGGULAN KAMI */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-[#ff2be0] text-[11px] font-bold tracking-wide">
            [ Produk Unggulan ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Produk <span className="text-[#ff2be0] font-black">Unggulan Kami</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Kami menghadirkan produk turunan kelapa terbaik yang diolah dengan prinsip berkelanjutan untuk mendukung gaya hidup sehat dan pertanian modern.
          </p>
        </div>

        {/* Center Button Below Title */}
        <div>
          <Link
            to="/produk"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold transition border border-slate-200/80 shadow-sm"
          >
            Lihat Semua Produk
          </Link>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
                <div className="h-48 overflow-hidden relative bg-slate-100">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#ff2be0] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff2be0]">{product.category}</span>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 mt-0.5">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-sm font-extrabold text-slate-900">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </span>
                    <a
                      href={`https://api.whatsapp.com/send?phone=6285395477026&text=${encodeURIComponent(`Halo Koperasi Niu Kencana Asri, saya berminat memesan produk: ${product.name}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-[#f42db7] rounded-xl transition-all duration-300 shadow hover:shadow-md hover:scale-105 active:scale-95"
                    >
                      Pesan via WA 
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* 5. SECTION: DASHBOARD VISUAL SENDIRI (ANALYTICS PREVIEW) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-[#ff2be0] text-[11px] font-bold tracking-wide">
            [ DASHBOARD METRIK ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Dashboard <span className="text-[#ff2be0] font-black">Visual Sendiri</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Statistik real-time Koperasi Niu Kencana Asri dalam mengembangkan komoditas lokal Parigi Moutong.
          </p>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          
          {/* Metric 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Produk Terdaftar</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">+Aktif</span>
            </div>
            <div className="text-4xl font-black text-slate-950">{products.length}</div>
            <div className="text-[11px] text-slate-400">Komoditas Siap Ekspor</div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Mitra & Petani</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px]">Terverifikasi</span>
            </div>
            <div className="text-4xl font-black text-slate-950">{partners.length}</div>
            <div className="text-[11px] text-slate-400">Kelompok Tani Sidoan</div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Total Transaksi</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold text-[10px]">Bulan Ini</span>
            </div>
            <div className="text-4xl font-black text-slate-950">Rp 0</div>
            <div className="text-[11px] text-slate-400">Penjualan Terdaftar</div>
          </div>

        </div>

        {/* Visual Analytics Container Frame */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/90 shadow-md overflow-hidden">
          <div className="bg-[#09090b] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <span>Dengan Dashboard Visual Sendiri</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff2be0] text-white text-[10px]">PRO KOPERASI</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://lookerstudio.google.com/reporting/c5e5b7f4-128d-4313-85ea-b4c71d327148/page/PMa7D"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-[#ff2be0] text-white text-[11px] font-bold transition flex items-center gap-1 border border-slate-700"
              >
                Buka Laporan Fullscreen ↗
              </a>
              <div className="text-slate-400 text-[11px] flex items-center gap-1 hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Realtime Data Studio
              </div>
            </div>
          </div>

          <div className="w-full relative overflow-hidden bg-white" style={{ minHeight: '520px' }}>
            <iframe
              title="Google Looker Studio Reporting - Koperasi Niu Kencana Asri"
              src="https://lookerstudio.google.com/embed/reporting/c5e5b7f4-128d-4313-85ea-b4c71d327148/page/PMa7D"
              className="w-full border-0 rounded-b-[2.5rem]"
              style={{ width: '100%', height: '560px', border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* 6. SECTION: UPDATE KEGIATAN & KEMITRAAN KAMI */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-[#ff2be0] text-[11px] font-bold tracking-wide">
            [ KABAR TERBARU ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Update Kegiatan & <span className="text-[#ff2be0] font-black">Kemitraan Kami</span>
          </h2>
        </div>

        {/* Partners Logos Auto-scroll Marquee & Scrollable Bar */}
        {partners.length > 0 && (
          <div className="relative overflow-hidden bg-white py-6 px-4 rounded-3xl border border-slate-200/80 shadow-sm group">
            {/* Soft gradient fade on left and right edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            {/* Scrollable Container with Marquee Animation */}
            <div className="marquee-container overflow-x-auto flex py-2 cursor-grab active:cursor-grabbing">
              <div className="animate-marquee-slow flex items-center gap-12 shrink-0">
                {/* Duplicated items to ensure seamless infinite looping */}
                {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((p, idx) => (
                  <div key={`${p.id}-${idx}`} className="h-14 flex items-center justify-center transition opacity-95 hover:opacity-100 hover:scale-105 shrink-0 px-4">
                    <img src={p.logo_url} alt={p.name} title={p.name} className="max-h-12 max-w-44 object-contain drop-shadow-sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* News Cards Grid on Home Page */}
        {newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {newsList.map((n) => {
              let photoCount = 1;
              let coverImg = n.image_url;
              if (n.images) {
                try {
                  const parsed = JSON.parse(n.images);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    photoCount = parsed.length;
                    coverImg = parsed[0];
                  }
                } catch (e) {}
              }

              return (
                <Link 
                  key={n.id} 
                  to={`/berita?id=${n.id}`} 
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col sm:flex-row cursor-pointer"
                >
                  <div className="sm:w-2/5 h-48 sm:h-auto bg-slate-100 relative overflow-hidden shrink-0">
                    <img 
                      src={coverImg || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'} 
                      alt={n.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    {photoCount > 1 && (
                      <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                        📷 {photoCount} Foto
                      </span>
                    )}
                  </div>
                  <div className="p-5 sm:w-3/5 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-[#ff2be0] uppercase tracking-wider">{n.category}</span>
                      <h4 className="font-bold text-slate-900 group-hover:text-[#ff2be0] transition text-base line-clamp-2">{n.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.excerpt || n.content}</p>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>{n.date || 'Terbaru'}</span>
                      <span className="text-[#ff2be0] font-bold text-xs group-hover:translate-x-1 transition-transform">Baca &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200/80 shadow-sm space-y-3">
            <p className="text-slate-400 text-xs font-semibold">
              Belum ada berita untuk ditampilkan.
            </p>
            <div>
              <Link to="/admin" className="text-xs font-bold text-[#ff2be0] hover:underline">
                Tambah Berita di Panel Admin &rarr;
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 7. SECTION: HUBUNGI KAMI UNTUK KERJA SAMA & INFORMASI (DARK CARD MATCHING IMAGE 4) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#09090b] text-white rounded-[2.5rem] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden shadow-2xl">
          
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Hubungi Kami Untuk<br />
              <span className="text-gradient-pink">Kerja Sama & Informasi</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-normal">
              Apakah Anda membutuhkan pasokan grosir kelapa, kemitraan perhutanan sosial, atau penawaran khusus? Tim kami siap melayani Anda.
            </p>

            {/* Email & Phone Pill Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="mailto:niukencana@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                <Mail className="w-4 h-4 text-pink-400" />
                niukencana@gmail.com
              </a>
              <a
                href="tel:085395477026"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                <Phone className="w-4 h-4 text-pink-400" />
                0853-9547-7026
              </a>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/kontak"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-pink-50 hover:text-[#ff2be0] transition shadow-md"
              >
                Hubungi Kami
              </Link>
              <a
                href="https://wa.me/6285395477026"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20"
              >
                WhatsApp Sekarang
              </a>
            </div>
          </div>

          {/* Right Map Image Preview Frame (Grayscale matching Image 4) */}
          <div className="lg:col-span-5 relative z-10">
            <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-xl h-56 bg-slate-900">
              <iframe
                title="Peta Satelit Niu Kencana Asri"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3501.4483968459676!2d120.180108!3d0.247943!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32760bd2dec38f53%3A0xba458f94ceabf0a7!2sNIU%20KENCANA%20ASRI!5e1!3m2!1sid!2sid!4v1789778269761!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full grayscale opacity-75 hover:opacity-100 transition duration-300"
              />
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* FLOATING QUICK CONTACT POP-UP WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* POP-UP MODAL WINDOW */}
        {showQuickContact && (
          <div className="mb-4 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#ff2be0] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                  💬
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-white">Kontak Cepat Koperasi</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    CS Siap Membantu
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowQuickContact(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="https://api.whatsapp.com/send?phone=6285395477026&text=Halo%20Koperasi%20Niu%20Kencana%20Asri,%20saya%20ingin%20bertanya..."
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-900 flex flex-col items-center text-center transition group shadow-sm"
                >
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform">💬</span>
                  <span className="font-extrabold text-xs">WhatsApp Direct</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Chat Seketika</span>
                </a>

                <a
                  href="tel:085395477026"
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-900 flex flex-col items-center text-center transition group shadow-sm"
                >
                  <PhoneCall className="w-5 h-5 text-pink-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-xs">Telepon CS</span>
                  <span className="text-[10px] text-slate-500 font-medium">0853-9547-7026</span>
                </a>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink-0 mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atau Kirim Pesan Cepat</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Form Success State */}
              {quickSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1 animate-in fade-in">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-extrabold">Pesan Berhasil Terkirim!</p>
                  <p className="text-[11px] text-emerald-700">Tim kami akan segera menghubungi Anda kembali.</p>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap Anda"
                      value={quickFormData.name}
                      onChange={(e) => setQuickFormData({ ...quickFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="No. WhatsApp / Email Anda"
                      value={quickFormData.contact}
                      onChange={(e) => setQuickFormData({ ...quickFormData, contact: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows="2"
                      placeholder="Tuliskan pertanyaan atau kebutuhan Anda..."
                      value={quickFormData.message}
                      onChange={(e) => setQuickFormData({ ...quickFormData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={quickSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#ff2be0] text-white font-bold text-xs transition-all duration-300 shadow flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {quickSubmitting ? 'Mengirim...' : 'Kirim Pesan Cepat'}
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* FLOATING ACTION TRIGGER BUTTON */}
        <button
          onClick={() => setShowQuickContact(!showQuickContact)}
          className="group px-4 py-3 rounded-full bg-slate-950 hover:bg-[#ff2be0] text-white font-extrabold text-xs shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 flex items-center gap-2.5 border border-slate-800 hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
          <MessageCircle className="w-4 h-4 text-pink-300 group-hover:text-white transition" />
          <span>{showQuickContact ? 'Tutup' : 'Kontak Cepat'}</span>
        </button>

      </div>

    </div>
  );
}
