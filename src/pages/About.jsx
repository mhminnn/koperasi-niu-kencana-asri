import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Award, 
  Users, 
  ShieldCheck, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Handshake,
  MessageCircle,
  ExternalLink,
  Share2
} from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function About() {
  const [partners, setPartners] = useState([]);
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/partners').then(r => r.json()),
      fetch('/api/socials').then(r => r.json())
    ])
      .then(([partnerData, socialData]) => {
        setPartners(Array.isArray(partnerData) ? partnerData : []);
        setSocials(Array.isArray(socialData) ? socialData : []);
      })
      .catch(err => console.error('Failed to load data in About:', err));
  }, []);

  return (
    <div className="space-y-20 pb-20 font-sans text-slate-800 selection:bg-[#ff2be0] selection:text-white">
      
      {/* 1. Hero Banner */}
      <section className="bg-gradient-pink-hero py-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f42db7] bg-pink-100/80 px-3.5 py-1.5 rounded-full border border-pink-200">
            PROFIL KOPERASI
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Tentang <span className="text-gradient-pink">Koperasi Niu Kencana Asri</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Koperasi Produsen yang bergerak di bidang pengolahan kelapa dan pengelolaan potensi perhutanan sosial berkelanjutan di Kabupaten Parigi Moutong, Sulawesi Tengah.
          </p>
        </div>
      </section>

      {/* 2. Main Profile Story & Team Photo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 relative">
            <img
              src="/about-team.jpg"
              alt="Perhutanan Sosial Niu Kencana"
              className="rounded-[2.5rem] shadow-xl border border-slate-100 object-cover w-full h-80 sm:h-[420px]"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 hidden sm:flex items-center gap-3">
              <div className="p-3 bg-pink-50 text-[#f42db7] rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Perhutanan Sosial</div>
                <div className="text-[11px] text-slate-500">Parigi Moutong, Sulteng</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-[11px] font-bold text-[#f42db7] uppercase tracking-widest">SEJARAH & LATAR BELAKANG</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
              Berkomitmen Mendorong Kesejahteraan Petani Kelapa Lokal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Koperasi Produsen Niu Kencana Asri didirikan dengan tekad untuk mengangkat potensi komoditas kelapa lokal dan kawasan perhutanan sosial menjadi produk olahan bernilai tinggi yang siap bersaing secara nasional maupun internasional.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Berlokasi di Kecamatan Sidoan, Parigi Moutong, koperasi kami mengintegrasikan ribuan hektar potensi perkebunan kelapa masyarakat dengan prinsip ekonomi sirkular.
            </p>

            <div className="pt-2">
              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181b] text-white hover:bg-slate-800 text-xs font-bold transition shadow-md"
              >
                Hubungi Pengurus Koperasi
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. VISI & MISI SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Visi & Misi List */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#fc83df]">
                VISI & MISI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Komitmen & Arah Langkah Kami
              </h2>

              <ol className="space-y-4 text-xs sm:text-sm text-slate-600 pt-2 list-decimal list-inside leading-relaxed font-medium">
                <li className="pl-1">
                  <span className="font-bold text-slate-900">Memanfaatkan potensi kelapa parigi</span> secara optimal dan berdaya saing ekspor.
                </li>
                <li className="pl-1">
                  <span className="font-bold text-slate-900">Memberdayakan kelompok tani lokal</span> melalui inovasi pengolahan produk ramah lingkungan.
                </li>
                <li className="pl-1">
                  <span className="font-bold text-slate-900">Menjaga pelestarian hutan sosial</span> melalui penerapan praktik perhutanan sosial berkelanjutan.
                </li>
                <li className="pl-1">
                  <span className="font-bold text-slate-900">Mendorong keterbukaan manajemen</span> dan pembagian hasil yang adil bagi seluruh anggota di Sidoan.
                </li>
              </ol>
            </div>
          </div>

          {/* Right Column: Pink Quote Card (#fc83df theme) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#fc83df] via-[#f559d2] to-[#e421be] text-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <p className="text-lg sm:text-2xl font-bold leading-relaxed tracking-tight font-serif italic">
                "Setiap tetes Minyak Kelapa Niu Kencana, setiap batang briket arang, dan setiap batok pupuk organik kami adalah bukti nyata pemberdayaan, keberlanjutan, dan pesona alam kita."
              </p>
              <div className="text-xs font-extrabold uppercase tracking-widest text-pink-100 pt-2">
                — Koperasi Niu Kencana Asri
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 4. Nilai - Nilai Utama Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f42db7]">NILAI KOPERASI</span>
          <h2 className="text-3xl font-extrabold text-slate-950">
            Prinsip & Nilai Integritas Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#f42db7] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-950 text-base">Pemberdayaan Inklusif</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Melibatkan petani, pemuda desa, dan kelompok perempuan dalam seluruh rantai nilai pengolahan kelapa.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#f42db7] flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-950 text-base">Ekonomi Sirkular</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Memanfaatkan 100% komponen kelapa tanpa merusak lingkungan demi prinsip keberlanjutan.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#f42db7] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-950 text-base">Tata Kelola Bersetandar</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menjaga transparansi manajemen keuangan dan pembagian hasil anggota secara adil.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#f42db7] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-950 text-base">Orientasi Pasar & Ekspor</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menjamin mutu produk agar senantiasa memenuhi standar kebutuhan pasar nasional dan mancanegara.
            </p>
          </div>
        </div>
      </section>

      {/* 5. MITRA KOLABORASI & KEMITRAAN SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200/90 shadow-sm space-y-8 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#f42db7] text-[11px] font-bold tracking-wide">
              <Handshake className="w-3.5 h-3.5" />
              MITRA KOPERASI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Kemitraan & <span className="text-[#f42db7]">Kolaborasi Strategis</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Koperasi Niu Kencana Asri bekerja sama dengan kementerian, pemerintah daerah, dan lembaga pendukung dalam mewujudkan perhutanan sosial serta ekonomi sirkular yang berkelanjutan.
            </p>
          </div>

          {partners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {partners.map((p) => (
                <div 
                  key={p.id} 
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col items-center justify-center space-y-3 hover:shadow-md transition"
                >
                  <div className="h-16 flex items-center justify-center">
                    <img src={p.logo_url} alt={p.name} title={p.name} className="max-h-14 max-w-44 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-xs sm:text-sm">{p.name}</h4>
                    {p.website && p.website !== '#' && (
                      <a 
                        href={p.website} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] font-bold text-[#f42db7] hover:underline"
                      >
                        Kunjungi Website &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada data mitra terdaftar.
            </div>
          )}
        </div>
      </section>

      {/* 6. MEDIA SOSIAL & SALURAN KOMUNIKASI SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#f42db7] text-[11px] font-bold tracking-wide">
              <Share2 className="w-3.5 h-3.5" />
              MEDIA SOSIAL RESMI
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Terhubung Dengan <span className="text-[#f42db7]">Media Sosial Kami</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Dapatkan berita terbaru, dokumentasi kegiatan perhutanan sosial, dan perkembangan olahan kelapa Koperasi Niu Kencana Asri secara langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socials.map((sc) => (
              <a
                key={sc.id}
                href={sc.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row hover:-translate-y-1"
              >
                {/* Left Cover Side (Banner & Icon) */}
                <div className={`sm:w-2/5 p-6 bg-gradient-to-r ${sc.cover_color || 'from-purple-600 via-pink-500 to-amber-500'} text-white flex flex-col justify-between relative overflow-hidden shrink-0`}>
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition duration-300" />
                  <span className="relative z-10 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow w-fit uppercase tracking-wider">
                    {sc.platform}
                  </span>
                  
                  <div className="relative z-10 pt-8 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow border border-white/30 group-hover:scale-110 transition-transform">
                      {sc.platform === 'Instagram' ? (
                        <InstagramIcon />
                      ) : sc.platform === 'Facebook' ? (
                        <FacebookIcon />
                      ) : sc.platform === 'YouTube' ? (
                        <YoutubeIcon />
                      ) : sc.platform === 'WhatsApp' ? (
                        <MessageCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-black text-base">TT</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base sm:text-lg leading-snug line-clamp-1">{sc.name}</h3>
                      <p className="text-xs text-white/90 font-semibold">{sc.handle}</p>
                    </div>
                  </div>
                </div>

                {/* Right Content Side (Description & Direct Button) */}
                <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {sc.description || 'Terhubung dengan media sosial resmi Koperasi Niu Kencana Asri.'}
                  </p>

                  <div className="pt-2">
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-[#f42db7] text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
                      <span>Kunjungi {sc.platform}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
