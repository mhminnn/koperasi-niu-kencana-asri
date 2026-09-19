import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ImageIcon, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare
} from 'lucide-react';

export default function News() {
  const [searchParams] = useSearchParams();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setNewsList(list);

      // Check if URL has ?id=X parameter to auto open article
      const newsId = searchParams.get('id');
      if (newsId) {
        const found = list.find(n => String(n.id) === String(newsId));
        if (found) {
          setSelectedNews(found);
        }
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically set Document Title & Meta Tags when selectedNews changes
  useEffect(() => {
    if (selectedNews) {
      document.title = `${selectedNews.title} - Koperasi Niu Kencana Asri`;
      
      // Update meta tags dynamically
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', selectedNews.title);

      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement('meta');
        ogImg.setAttribute('property', 'og:image');
        document.head.appendChild(ogImg);
      }
      const photos = getNewsPhotos(selectedNews);
      ogImg.setAttribute('content', photos[0] || window.location.origin + '/about-team.jpg');
    } else {
      document.title = 'Kabar Terbaru Niu Kencana - Koperasi Niu Kencana Asri';
    }
  }, [selectedNews]);

  const getNewsPhotos = (news) => {
    if (!news) return [];
    if (news.images) {
      try {
        const parsed = JSON.parse(news.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return news.image_url ? [news.image_url] : [];
  };

  const filteredNews = newsList.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getShareUrl = (newsId) => {
    return `${window.location.origin}/share/news/${newsId}`;
  };

  const handleCopyLink = (newsId) => {
    const shareUrl = getShareUrl(newsId);
    navigator.clipboard.writeText(shareUrl);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      
      {/* Header Matching Image 1 */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Kabar Terbaru <span className="text-[#f42db7]">Niu Kencana</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Ikuti perkembangan terbaru mengenai kegiatan, inovasi, dan kemitraan strategis Koperasi Niu Kencana Asri.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berita atau kegiatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#f42db7]/20 focus:border-[#f42db7] transition bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Article Detail View */}
      {selectedNews ? (
        <div className="bg-white rounded-3xl p-5 sm:p-10 border border-slate-200 shadow-md space-y-6 max-w-4xl mx-auto animate-fade-in relative">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <button
              onClick={() => {
                setSelectedNews(null);
                setActivePhotoIndex(0);
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#f42db7] bg-slate-100 hover:bg-pink-50 px-4 py-2 rounded-full transition"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
            </button>

            {/* Social Share Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-[#f42db7]" /> Bagikan:
              </span>

              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${selectedNews.title}*\n${selectedNews.excerpt || ''}\n\nBaca selengkapnya di: ${getShareUrl(selectedNews.id)}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition shadow-sm"
                title="Bagikan ke WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(selectedNews.id))}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm"
                title="Bagikan ke Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={() => handleCopyLink(selectedNews.id)}
                className="p-2 rounded-full bg-pink-50 text-[#f42db7] hover:bg-[#f42db7] hover:text-white transition shadow-sm relative"
                title="Salin Tautan Berita"
              >
                {copiedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Copy Link Toast Notification */}
          {copiedToast && (
            <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full text-center shadow-lg animate-fade-in w-fit mx-auto">
              ✓ Tautan Berita Berhasil Disalin!
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-pink-100 text-[#f42db7] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedNews.category || 'Berita'}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedNews.date || 'Terbaru'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {selectedNews.title}
            </h2>
          </div>

          {/* 5-Photo Gallery Display */}
          {(() => {
            const photos = getNewsPhotos(selectedNews);
            if (photos.length === 0) return null;
            const currentImg = photos[activePhotoIndex] || photos[0];

            return (
              <div className="space-y-4">
                {/* Main Selected Image */}
                <div className="rounded-2xl overflow-hidden h-72 sm:h-[420px] bg-slate-950 relative group border border-slate-100 shadow-md">
                  <img
                    src={currentImg}
                    alt={`${selectedNews.title} Foto ${activePhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:bg-[#f42db7] transition backdrop-blur-md"
                        title="Foto Sebelumnya"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActivePhotoIndex((activePhotoIndex + 1) % photos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:bg-[#f42db7] transition backdrop-blur-md"
                        title="Foto Selanjutnya"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                        {activePhotoIndex + 1} / {photos.length} Foto
                      </span>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip (Up to 5 Photos) */}
                {photos.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {photos.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`relative rounded-xl overflow-hidden w-20 h-16 shrink-0 border-2 transition ${
                          activePhotoIndex === idx
                            ? 'border-[#f42db7] scale-105 shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line pt-4 border-t border-slate-100">
            {selectedNews.content}
          </div>
        </div>
      ) : (
        /* News List Grid or Empty State */
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((news) => {
                const photos = getNewsPhotos(news);
                const cover = photos[0] || '/about-team.jpg';

                return (
                  <div
                    key={news.id}
                    onClick={() => {
                      setSelectedNews(news);
                      setActivePhotoIndex(0);
                    }}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col cursor-pointer group"
                  >
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      <img
                        src={cover}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow">
                        {news.category || 'Berita'}
                      </span>
                      {photos.length > 1 && (
                        <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                          <ImageIcon className="w-3 h-3 text-pink-400" />
                          {photos.length} Foto
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3 text-[#f42db7]" />
                          {news.date || 'Terbaru'}
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-[#f42db7] transition text-base line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {news.excerpt || news.content}
                        </p>
                      </div>

                      <div className="pt-2 text-xs font-bold text-[#f42db7] group-hover:translate-x-1 transition-transform flex items-center justify-between">
                        <span>Baca Selengkapnya</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State Container */
            <div className="bg-white rounded-[2rem] p-16 sm:p-20 text-center border border-slate-200/70 shadow-sm max-w-4xl mx-auto my-6">
              <p className="text-slate-400 text-xs font-normal">
                Belum ada berita untuk ditampilkan.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
