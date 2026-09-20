import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, X, Send, Sparkles, RefreshCw, PhoneCall, ExternalLink, MessageSquare, ChevronRight, User, GripHorizontal } from 'lucide-react';

const callGeminiApi = async (userQuery, dbProducts) => {
  let apiKey = '';
  try {
    const keyRes = await fetch('/api/settings/ai-key');
    if (keyRes.ok) {
      const keyData = await keyRes.json();
      if (keyData.apiKey && keyData.apiKey.trim()) {
        apiKey = keyData.apiKey.trim();
      }
    }
  } catch (e) {
    console.log('Using fallback Gemini API key');
  }

  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemma-4-26b-a4b-it', 'gemini-flash-latest'];

  const productSummary = (dbProducts && dbProducts.length > 0)
    ? dbProducts.map((p, i) => `${i + 1}. ${p.name} - Rp ${Number(p.price || 0).toLocaleString('id-ID')} (Kategori: ${p.category || 'Olahan Kelapa'}). Deskripsi: ${p.description || '-'}`).join('\n')
    : "1. Minyak Kelapa Kampung Niu Kencana 500 Ml - Rp 36.000\n2. Minyak Kelapa Kampung Niu Kencana 250 Ml - Rp 18.000\n3. Pupuk Organik Cair Tunas Hibrida - Rp 25.000\n4. Sabun Magaya - Rp 20.000\n5. Tahi Minyak Sanggal Latap - Rp 15.000";

  const systemPrompt = `Kamu adalah NiuBot, asisten AI Customer Service resmi khusus untuk Koperasi Niu Kencana Asri (Parigi Moutong, Sulawesi Tengah).

ATURAN DAN BATASAN TOPIK PERTANYAAN (STRICT GUARDRAILS):
1. JAWAB HANYA pertanyaan yang berhubungan langsung dengan Koperasi Niu Kencana Asri, meliputi:
   - Produk-produk olahan kelapa dan turunan pertanian Koperasi Niu Kencana Asri (Minyak Kelapa Kampung Niu Kencana 500ml/250ml, Pupuk Organik Cair Tunas Hibrida, Sabun Magaya, Tahi Minyak Sanggal Latap, harga, keunggulan, serta cara pemesanannya).
   - Profil Koperasi Niu Kencana Asri, lokasi/alamat di Parigi Moutong Sulawesi Tengah, jam operasional, kontak WhatsApp, sejarah singkat, serta program Perhutanan Sosial dan kemitraan petani.
   - Cara bergabung sebagai anggota, mitra petani kelapa, distributor, atau reseller.
2. JIKA pengguna mengajukan pertanyaan DI LUAR TOPIK Koperasi Niu Kencana Asri (misalnya: koding/pemrograman, matematika, politik, gosip/selebriti, berita umum, olahraga, cuaca luar daerah, produk toko lain, atau topik pengetahuan umum lainnya):
   - JANGAN menjawab pertanyaan umum tersebut.
   - Jawablah dengan penolakan sopan dan ramah.
   - Contoh kalimat penolakan ramah: "Maaf, saya NiuBot khusus membantu pertanyaan seputar Koperasi Niu Kencana Asri (produk olahan kelapa, kemitraan, dan layanan kami). Silakan tanyakan hal-hal yang berkaitan dengan Koperasi Niu Kencana Asri."
3. Gunakan bahasa Indonesia yang ramah, sopan, dan profesional. JANGAN menggunakan emoji/emoticon secara berlebihan (maksimal 1 emoji ramah jika benar-benar diperlukan).

INFORMASI DATABASE PRODUK REAL KOPERASI NIU KENCANA ASRI SAAT INI:
${productSummary}

INFORMASI UMUM KOPERASI:
- Alamat: Kabupaten Parigi Moutong, Sulawesi Tengah.
- Program Utama: Olahan Kelapa Terpadu, Perhutanan Sosial, dan Kemitraan Petani Kelapa.
- Kontak Official WhatsApp & Telepon: 0853-9547-7026
- Jam Operasional: Senin - Sabtu (08.00 - 17.00 WITA)

Pertanyaan Pengguna: "${userQuery}"

Berikan jawaban singkat, jelas, ramah, dan akurat sesuai aturan dan batasan topik di atas.`;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (err) {
      console.log(`Gemini model ${model} skipped:`, err);
    }
  }

  return null;
};

// KNOWLEDGE BASE KOPERASI NIU KENCANA ASRI
const KNOWLEDGE_BASE = [
  {
    keywords: ['produk', 'jual', 'katalog', 'minyak', 'pupuk', 'sabun', 'tahi', 'harga'],
    reply: "Koperasi Niu Kencana Asri menyediakan produk olahan kelapa dan turunan pertanian berkualitas unggulan dari Parigi Moutong, Sulawesi Tengah:\n\n1. **Minyak Kelapa Kampung Niu Kencana 500 Ml** - Rp 36.000\n2. **Minyak Kelapa Kampung Niu Kencana 250 Ml** - Rp 18.000\n3. **Pupuk Organik Cair Tunas Hibrida** - Rp 25.000\n4. **Sabun Magaya** - Rp 20.000\n5. **Tahi Minyak Sanggal Latap** - Rp 15.000\n\nSilakan tanyakan detail produk yang Anda inginkan atau hubungi admin via WhatsApp untuk pemesanan.",
    quickChips: ["Pesan Minyak Kelapa", "Pesan Pupuk Organik", "Pesan Sabun Magaya"]
  },
  {
    keywords: ['koperasi', 'tentang', 'profil', 'sejarah', 'visi', 'misi', 'lokasi', 'alamat', 'parigi', 'sulteng', 'dimana'],
    reply: "Koperasi Niu Kencana Asri adalah koperasi produsen olahan kelapa terkemuka yang berbasis di Kabupaten Parigi Moutong, Sulawesi Tengah.\n\nKami berkomitmen mendorong kesejahteraan petani lokal melalui pengelolaan potensi kelapa terpadu dan program Perhutanan Sosial. Kami mengolah kelapa rakyat menjadi produk bernilai tambah dengan standar kualitas unggul.",
    quickChips: ["Lokasi & Kontak", "Siapa Pengurusnya?", "Program Perhutanan Sosial"]
  },
  {
    keywords: ['mitra', 'gabung', 'petani', 'kemitraan', 'kerjasama', 'supplier', 'pasok', 'anggota'],
    reply: "Kami terbuka untuk kemitraan:\n\n- **Untuk Petani Kelapa**: Kami siap menampung dan membina hasil panen kelapa dengan harga adil.\n- **Untuk Distributor/Grosir**: Kami menyediakan pasokan produk olahan kelapa bermutu tinggi dengan skema partai besar.\n\nSilakan hubungi tim kami untuk konsultasi kemitraan.",
    quickChips: ["Hubungi WA Kemitraan", "Persyaratan Mitra"]
  },
  {
    keywords: ['kontak', 'hubungi', 'wa', 'whatsapp', 'telepon', 'hp', 'email', 'alamat'],
    reply: "Anda dapat menghubungi tim Koperasi Niu Kencana Asri secara langsung:\n\n- **WhatsApp**: 0853-9547-7026\n- **Telepon**: 0853-9547-7026\n- **Alamat**: Parigi Moutong, Sulawesi Tengah\n- **Jam Kerja**: Senin - Sabtu (08.00 - 17.00 WITA)",
    quickChips: ["Chat WA Direct", "Telepon Sekarang"]
  },
  {
    keywords: ['halo', 'hai', 'pagi', 'siang', 'sore', 'malam', 'assalamu', 'permisi', 'bot', 'admin', 'cs'],
    reply: "Halo, selamat datang di Koperasi Niu Kencana Asri. Saya **NiuBot**, asisten AI CS Anda. Ada yang bisa saya bantu mengenai produk kelapa, kemitraan, atau informasi koperasi?",
    quickChips: ["Lihat Produk", "Tentang Koperasi", "Cara Order"]
  }
];

// EXPRESSIVE AVATAR FACE COMPONENT (NATURAL & ALIVE)
const ExpressiveAvatar = ({ expression, isMobile = false, isHovered = false }) => {
  const [blink, setBlink] = useState(false);
  const [mouthPhase, setMouthPhase] = useState(0);
  const [idleMood, setIdleMood] = useState('normal'); // 'normal' | 'wink' | 'look_left' | 'look_right' | 'happy_arcs'

  // Natural Random Blinking with Double-Blink Chance
  useEffect(() => {
    let timerId;
    const scheduleBlink = () => {
      const nextBlinkDelay = Math.random() * 2500 + 2000; // Random 2s - 4.5s
      timerId = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          // 20% Chance of an immediate double-blink for natural life effect
          if (Math.random() < 0.2) {
            setTimeout(() => {
              setBlink(true);
              setTimeout(() => setBlink(false), 150);
            }, 120);
          }
        }, 160);
        scheduleBlink();
      }, nextBlinkDelay);
    };

    scheduleBlink();
    return () => clearTimeout(timerId);
  }, []);

  // Periodic Natural Idle Expression Shifts (When in 'happy' state and not hovered)
  useEffect(() => {
    if (expression !== 'happy' || isHovered) {
      setIdleMood('normal');
      return;
    }

    const moodInterval = setInterval(() => {
      const moods = ['normal', 'normal', 'wink', 'look_left', 'look_right', 'happy_arcs'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setIdleMood(randomMood);

      // Reset back to normal after a brief natural moment
      setTimeout(() => {
        setIdleMood('normal');
      }, 2000);
    }, 6500);

    return () => clearInterval(moodInterval);
  }, [expression, isHovered]);

  // Mouth animation cycling during 'talking' expression
  useEffect(() => {
    if (expression === 'talking') {
      const talkInterval = setInterval(() => {
        setMouthPhase((prev) => (prev + 1) % 4);
      }, 140);
      return () => clearInterval(talkInterval);
    }
  }, [expression]);

  // Determine active visual state: Active AI states (thinking, talking, listening, excited) take top priority!
  const activeExpression = (expression !== 'happy')
    ? expression
    : (isHovered ? 'excited' : (idleMood !== 'normal' ? idleMood : 'happy'));

  const sizeClass = isMobile
    ? "w-8 h-8 sm:w-10 sm:h-10"
    : "w-11 h-11 sm:w-14 sm:h-14";

  return (
    <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>

      {/* Background Glow Aura */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 ${activeExpression === 'thinking' ? 'bg-amber-400/40 animate-ping' :
            activeExpression === 'talking' ? 'bg-pink-500/40 animate-pulse' :
              activeExpression === 'excited' || isHovered ? 'bg-[#ff4bd8]/50 scale-125 blur-sm' :
                'bg-gradient-to-tr from-pink-500/30 via-purple-500/20 to-emerald-400/30'
          }`}
      />

      {/* Main Avatar Head (Borderless & Simple) */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-lg p-1.5 flex flex-col items-center justify-center overflow-hidden">

        {/* Coconut Crown Accent */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Sparkle Icons for Excited or Hovered state */}
        {(activeExpression === 'excited' || isHovered) && (
          <div className="absolute top-1 right-1 text-yellow-300 text-[10px] animate-spin">
            ✨
          </div>
        )}

        {/* SVG Face Features */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow transition-all duration-300">

          {/* EYES (MATA POLOS SOLID) */}
          {blink ? (
            // Blink State - Curved Happy Arcs ^ ^ (Ref Image 4)
            <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none">
              <path d="M 20 44 Q 33 26 46 44" />
              <path d="M 54 44 Q 67 26 80 44" />
            </g>
          ) : activeExpression === 'wink' ? (
            // Natural Wink (Left eye solid dot, Right eye winking arc with eyelashes)
            <g>
              <g fill="#ffffff">
                <circle cx="31" cy="42" r="9.5" />
              </g>
              <g stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" fill="none">
                <path d="M 54 44 Q 67 26 80 44" />
                <line x1="82" y1="42" x2="88" y2="34" />
                <line x1="76" y1="32" x2="80" y2="24" />
              </g>
            </g>
          ) : activeExpression === 'excited' || activeExpression === 'happy_arcs' ? (
            // Excited / Happy Arcs ^ ^ with Eyelashes (Ref Image 1 & 3)
            <g stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" fill="none">
              <path d="M 20 44 Q 33 26 46 44" />
              <path d="M 54 44 Q 67 26 80 44" />
              <line x1="18" y1="42" x2="12" y2="34" />
              <line x1="24" y1="32" x2="20" y2="24" />
              <line x1="82" y1="42" x2="88" y2="34" />
              <line x1="76" y1="32" x2="80" y2="24" />
            </g>
          ) : activeExpression === 'thinking' ? (
            // Thinking State - Solid dots shifted up-right
            <g fill="#ffffff">
              <circle cx="36" cy="38" r="9.5" />
              <circle cx="72" cy="38" r="9.5" />
            </g>
          ) : activeExpression === 'look_left' ? (
            // Glancing Left - Solid dots shifted left
            <g fill="#ffffff">
              <circle cx="27" cy="42" r="9.5" />
              <circle cx="65" cy="42" r="9.5" />
            </g>
          ) : activeExpression === 'look_right' ? (
            // Glancing Right - Solid dots shifted right
            <g fill="#ffffff">
              <circle cx="35" cy="42" r="9.5" />
              <circle cx="73" cy="42" r="9.5" />
            </g>
          ) : (
            // Default Mata Polos - Solid White Circles
            <g fill="#ffffff">
              <circle cx="31" cy="42" r="9.5" />
              <circle cx="69" cy="42" r="9.5" />
            </g>
          )}

          {/* Cheeks (Soft Rosy Blush) */}
          <ellipse cx="18" cy="56" rx="5.5" ry="3.5" fill="#f43f5e" opacity="0.7" />
          <ellipse cx="82" cy="56" rx="5.5" ry="3.5" fill="#f43f5e" opacity="0.7" />

          {/* MOUTH (MULUT KAWAII / CHIBI) */}
          {activeExpression === 'talking' || activeExpression === 'excited' || isHovered ? (
            // Big Open D-Mouth with Tongue (Ref Image 1 & 3)
            <g>
              <path d="M 32 60 L 68 60 C 68 78, 32 78, 32 60 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
              <path d="M 38 71 Q 50 62 62 71 Q 50 78 38 71 Z" fill="#f43f5e" />
            </g>
          ) : activeExpression === 'thinking' ? (
            // Thinking Small Curve
            <path d="M 40 66 Q 50 60 60 66" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none" />
          ) : (
            // Default / Soft Smile (Ref Image 2 & 4)
            <path d="M 35 63 Q 50 77 65 63" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          )}
        </svg>

        {/* Floating Expression Badge */}
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border border-slate-900 flex items-center justify-center text-[8px]">
          {activeExpression === 'thinking' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
          {activeExpression === 'talking' && <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />}
          {(activeExpression === 'excited' || isHovered) && <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />}
          {activeExpression !== 'thinking' && activeExpression !== 'talking' && activeExpression !== 'excited' && !isHovered && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default function AiCustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Halo! Selamat datang di **Koperasi Niu Kencana Asri**.\nSaya **NiuBot**, asisten AI CS Anda. Ada yang bisa saya bantu tentang produk olahan kelapa, kemitraan petani, atau informasi koperasi?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickChips: ["Produk Unggulan", "Tentang Koperasi", "Cara Order / WA"]
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expression, setExpression] = useState('happy'); // 'happy' | 'thinking' | 'talking' | 'excited' | 'listening'
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const chatEndRef = useRef(null);

  // SPEECH BUBBLE GUIDE STATE (BALON PERCAKAPAN ONCE-PER-SESSION)
  const [speechBubble, setSpeechBubble] = useState({ show: false, title: '', text: '' });
  const shownSectionsRef = useRef(new Set());
  const speechTimerRef = useRef(null);

  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbProducts(data);
        }
      })
      .catch((err) => console.log('NiuBot product fetch note:', err));
  }, []);

  const location = useLocation();

  const triggerSpeechBubble = (key, title, text) => {
    // Show each explanation speech bubble ONLY ONCE per session
    if (shownSectionsRef.current.has(key)) return;
    shownSectionsRef.current.add(key);

    setSpeechBubble({ show: true, title, text });
    setExpression('excited'); // Smile expression while explaining!
    setTimeout(() => setExpression('happy'), 2200);

    clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setSpeechBubble((prev) => ({ ...prev, show: false }));
    }, 4500); // Shorter duration (4.5s) so message doesn't linger
  };

  // First-Time Visitor Warm Welcome Greeting
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('niubot_welcome_seen');
    if (!hasSeenWelcome && !isOpen) {
      sessionStorage.setItem('niubot_welcome_seen', 'true');
      const timer = setTimeout(() => {
        triggerSpeechBubble(
          'welcome',
          'Selamat Datang',
          'Halo! Selamat datang di website resmi Koperasi Niu Kencana Asri. Saya NiuBot, asisten AI CS yang siap menemani Anda menjelajahi informasi dan olahan kelapa dari Parigi Moutong.'
        );
        setExpression('excited');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Route Change Listener (Triggers ONCE per unique page route)
  useEffect(() => {
    if (isOpen) return;

    const path = location.pathname;
    let title = '';
    let text = '';

    if (path === '/tentang-kami') {
      title = 'Profil & Pengurus Koperasi';
      text = 'Mari berkenalan lebih dekat! Di halaman ini Anda bisa melihat cerita perjuangan petani, visi besar, serta susunan pengurus Koperasi Niu Kencana Asri.';
    } else if (path === '/produk') {
      title = 'Katalog Produk Koperasi';
      text = 'Selamat memilih! Di sini tersedia produk resmi Koperasi seperti Minyak Kelapa Kampung Niu Kencana, Pupuk Organik Cair Tunas Hibrida, dan Sabun Magaya. Tinggal klik untuk pesan via WA.';
    } else if (path === '/berita') {
      title = 'Ruang Berita & Edukasi';
      text = 'Temukan kabar terbaru seputar kegiatan Koperasi, kisah lapangan petani, dan edukasi pengembangan Perhutanan Sosial di Parigi Moutong.';
    } else if (path === '/kontak') {
      title = 'Hubungi Kami';
      text = 'Ada pertanyaan, butuh pasokan partai besar, atau berminat jadi mitra? Tim kami siap berdiskusi langsung via WhatsApp atau Telepon.';
    }

    if (title && text) {
      triggerSpeechBubble(`route_${path}`, title, text);
    }
  }, [location.pathname, isOpen]);

  // Home Page Section Scroll Listener using IntersectionObserver on [data-section] (Triggers ONCE per section)
  useEffect(() => {
    if (location.pathname !== '/' || isOpen) return;

    const sections = document.querySelectorAll('[data-section]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section');
            let sectionKey = null;
            let title = '';
            let text = '';

            if (sectionName === 'hero') {
              sectionKey = 'home_hero';
              title = 'Selamat Datang';
              text = 'Halo! Ini adalah beranda Koperasi Niu Kencana Asri—wadah produsen olahan kelapa terpadu berbasis Perhutanan Sosial di Parigi Moutong, Sulteng.';
            } else if (sectionName === 'produk') {
              sectionKey = 'home_produk';
              title = 'Produk Unggulan Koperasi';
              text = 'Lihat nih! Ini jajaran produk unggulan kami: Minyak Kelapa Kampung Niu Kencana, Pupuk Organik Cair Tunas Hibrida, dan Sabun Magaya. Diproses langsung dari petani lokal.';
            } else if (sectionName === 'nilai' || sectionName === 'visi') {
              sectionKey = 'home_nilai_visi';
              title = 'Mengenal Koperasi Kami';
              text = 'Koperasi kami hadir untuk memberdayakan petani lokal melalui tata kelola inklusif dan ekonomi sirkular ramah lingkungan.';
            } else if (sectionName === 'dashboard') {
              sectionKey = 'home_dashboard';
              title = 'Statistik & Dampak Koperasi';
              text = 'Di sini Anda dapat menyimak capaian produksi kelapa, statistik pemberdayaan petani, dan dampak positif perhutanan sosial.';
            } else if (sectionName === 'berita') {
              sectionKey = 'home_berita';
              title = 'Kabar & Kegiatan Terbaru';
              text = 'Di sini Anda dapat menyimak kabar pelatihan petani, liputan kegiatan, dan artikel edukasi kelapa.';
            } else if (sectionName === 'kontak') {
              sectionKey = 'home_kontak';
              title = 'Kontak & Kemitraan';
              text = 'Tertarik memesan grosir, pasokan rutin, atau bergabung menjadi mitra? Tim Koperasi kami siap berdiskusi lewat WhatsApp atau Telepon.';
            }

            if (sectionKey) {
              triggerSpeechBubble(sectionKey, title, text);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, isOpen]);

  // DRAGGABLE WIDGET STATE & HANDLERS
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Relative offset in pixels
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = { x: clientX, y: clientY };
    initialPosRef.current = { ...position };
    hasMovedRef.current = false;
    setIsDragging(true);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }

      setPosition({
        x: initialPosRef.current.x + dx,
        y: initialPosRef.current.y + dy,
      });
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, position]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Expression controller logic
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0 && expression !== 'listening' && !isTyping) {
      setExpression('listening');
    } else if (e.target.value.length === 0 && !isTyping) {
      setExpression('happy');
    }
  };

  // Find best response from Knowledge Base or fallback
  const getAiResponse = (userQuery) => {
    const queryLower = userQuery.toLowerCase();

    // Dynamic product query handling directly from database products
    if (['produk', 'jual', 'katalog', 'minyak', 'vco', 'gula', 'briket', 'arang', 'harga'].some(kw => queryLower.includes(kw))) {
      let productText = '';
      let chips = [];

      if (dbProducts.length > 0) {
        productText = dbProducts.map((p, i) => {
          const emoji = p.name.toLowerCase().includes('vco') || p.name.toLowerCase().includes('minyak') ? '🥥' :
            p.name.toLowerCase().includes('gula') ? '🍯' :
              p.name.toLowerCase().includes('briket') || p.name.toLowerCase().includes('arang') ? '🪵' : '✨';
          const priceText = p.price ? ` - Rp ${Number(p.price).toLocaleString('id-ID')}` : '';
          return `${i + 1}. ${emoji} **${p.name}**${priceText}\n   _${p.description || 'Produk unggulan Koperasi Niu Kencana Asri'}_`;
        }).join('\n\n');

        chips = dbProducts.slice(0, 3).map(p => `Pesan ${p.name.split(' ')[0]} via WA`);
      } else {
        productText = "1. 🥥 **Minyak Kelapa Murni (VCO) Premium** - Rp 85.000\n   _Minyak kelapa murni diekstrak dari kelapa segar pilihan khas Parigi Moutong dengan metode cold-pressed._\n\n2. 🍯 **Gula Kelapa Organik (Coconut Sugar)** - Rp 45.000\n   _Gula merah kelapa berbentuk kristal organik berkualitas ekspor tanpa pengawet._\n\n3. 🪵 **Briket Arang Batok Kelapa** - Rp 35.000\n   _Briket arang kualitas tinggi dengan daya bakar tinggi dan minim asap._";
        chips = ["Pesan VCO via WA", "Pesan Gula Kelapa", "Pesan Briket Arang"];
      }

      return {
        reply: `Koperasi Niu Kencana Asri menawarkan produk olahan kelapa berkualitas unggulan sesuai katalog database kami:\n\n${productText}\n\nIngin info pemesanan langsung?`,
        quickChips: chips
      };
    }

    for (const kb of KNOWLEDGE_BASE) {
      if (kb.keywords.some((kw) => queryLower.includes(kw))) {
        return {
          reply: kb.reply,
          quickChips: kb.quickChips || []
        };
      }
    }

    // Default Fallback
    return {
      reply: `Maaf, sebagai asisten NiuBot, saya khusus melayani pertanyaan seputar Koperasi Niu Kencana Asri, produk olahan kelapa, dan layanan kemitraan kami.\n\nSilakan tanyakan hal-hal terkait produk, harga, lokasi, atau hubungi customer service kami via WhatsApp.`,
      quickChips: ["Lihat Katalog Produk", "Hubungi WA CS", "Tentang Koperasi"]
    };
  };

  // Handle Send Message
  const handleSend = async (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Set avatar state to 'thinking'
    setIsTyping(true);
    setExpression('thinking');

    // Call Google AI Studio Gemini API with database context
    const aiText = await callGeminiApi(query, dbProducts);

    // Switch to 'talking'
    setExpression('talking');

    let botReplyText = '';
    let botChips = [];

    if (aiText) {
      botReplyText = aiText;
      botChips = ["Pesan via WA", "Lihat Produk", "Tanya Koperasi"];
    } else {
      const response = getAiResponse(query);
      botReplyText = response.reply;
      botChips = response.quickChips;
    }

    const botMsg = {
      id: Date.now() + 1,
      sender: 'bot',
      text: botReplyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickChips: botChips
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);

    // Transition to 'excited' briefly, then 'happy'
    setTimeout(() => setExpression('excited'), 800);
    setTimeout(() => setExpression('happy'), 2500);
  };

  const handleChipClick = (chipText) => {
    if (chipText.includes("WA") || chipText.includes("WhatsApp")) {
      window.open(
        `https://api.whatsapp.com/send?phone=6285395477026&text=${encodeURIComponent(`Halo CS Koperasi Niu Kencana Asri, saya ingin bertanya: ${chipText}`)}`,
        '_blank'
      );
      return;
    }
    handleSend(chipText);
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "Percakapan telah diperbarui. Halo lagi! Ada yang bisa NiuBot bantu? 😊",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickChips: ["Produk Unggulan 🥥", "Tentang Koperasi 🌴", "Cara Order / WA 💬"]
      }
    ]);
    setExpression('happy');
  };

  return (
    <div
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
    >

      {/* CHAT WINDOW MODAL */}
      {isOpen && (
        <div className="mb-3 sm:mb-4 w-[calc(100vw-1.5rem)] max-w-[340px] sm:max-w-none sm:w-[400px] h-[430px] sm:h-[520px] max-h-[72vh] sm:max-h-[82vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header & Drag Handle Bar */}
          <div
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-2.5 sm:p-3 px-3 sm:px-4 flex items-center justify-between border-b border-slate-800 touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} active:cursor-grabbing hover:bg-slate-900/80 transition-colors`}
            title="Tahan & geser untuk memindahkan chat window"
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Drag Handle Grip Icon */}
              <div className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                <GripHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {/* Expressive Face Avatar */}
              <ExpressiveAvatar expression={expression} isMobile={true} />

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs sm:text-sm text-white leading-none">NiuBot AI</h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-pink-500/20 text-[#ff4bd8] text-[8px] sm:text-[9px] font-bold border border-pink-500/30">
                    CS Ekspresif
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-medium mt-0.5 sm:mt-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {expression === 'thinking' ? 'Sedang berpikir...' :
                    expression === 'talking' ? 'NiuBot merespons...' :
                      expression === 'listening' ? 'Mendengarkan Anda...' :
                        expression === 'excited' ? 'Senang membantu! ✨' :
                          'Geser untuk memindahkan • Online'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <button
                onClick={handleReset}
                title="Perbarui percakapan"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 bg-slate-950/60 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
              >
                <div className="flex items-end gap-1.5 sm:gap-2 max-w-[88%] sm:max-w-[85%]">
                  {msg.sender === 'bot' && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-pink-600/20 border border-pink-500/40 text-pink-300 flex items-center justify-center shrink-0 mb-1">
                      <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs leading-relaxed ${msg.sender === 'user'
                        ? 'bg-gradient-to-r from-pink-600 to-[#e61cb0] text-white rounded-br-xs shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow'
                      }`}
                  >
                    <div className="whitespace-pre-line font-medium">
                      {msg.text}
                    </div>
                    <div
                      className={`text-[8px] sm:text-[9px] mt-1 sm:mt-1.5 text-right font-mono opacity-60 ${msg.sender === 'user' ? 'text-pink-100' : 'text-slate-400'
                        }`}
                    >
                      {msg.time}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mb-1">
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  )}
                </div>

                {/* Quick Chips Suggestion Buttons */}
                {msg.sender === 'bot' && msg.quickChips && msg.quickChips.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 ml-6 sm:ml-8 max-w-[88%] sm:max-w-[85%]">
                    {msg.quickChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChipClick(chip)}
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-900 hover:bg-pink-600/20 border border-pink-500/30 text-pink-300 hover:text-white text-[9px] sm:text-[10px] font-semibold transition flex items-center gap-1 group shadow-sm active:scale-95"
                      >
                        <span>{chip}</span>
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform text-pink-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs animate-pulse ml-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 sm:p-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 ml-1">NiuBot sedang menyiapkan jawaban...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Direct WA Bar */}
          <div className="bg-slate-950 px-3 sm:px-4 py-1.5 sm:py-2 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Respon manusia?
            </span>
            <a
              href="https://api.whatsapp.com/send?phone=6285395477026&text=Halo%20Koperasi%20Niu%20Kencana%20Asri,%20saya%20ingin%20bertanya%20langsung..."
              target="_blank"
              rel="noreferrer"
              className="text-[9px] sm:text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline transition"
            >
              <PhoneCall className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> WA Admin Direct <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            </a>
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2 sm:p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Tulis pertanyaan seputar Koperasi..."
              className="flex-1 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-[#ff2be0] hover:from-pink-500 hover:to-pink-600 disabled:opacity-40 text-white font-bold transition shadow-lg shrink-0 flex items-center justify-center active:scale-95"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>

        </div>
      )}

      {/* SPEECH BUBBLE TOOLTIP (BALON PERCAKAPAN NAVIGASI & SCROLL GUIDE) */}
      {speechBubble.show && !isOpen && (
        <div className="mb-2 sm:mb-3 w-[calc(100vw-2rem)] max-w-[280px] sm:max-w-none sm:w-[320px] bg-slate-900/95 backdrop-blur-md text-white p-2.5 sm:p-3.5 rounded-2xl shadow-2xl border border-pink-500/40 relative animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* Speech Bubble Pointer Tail (Matching Reference Images 1 & 2) */}
          <div className="absolute -bottom-2 right-5 sm:right-6 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-slate-900 border-b border-r border-pink-500/40 rotate-45" />

          <div className="flex items-center justify-between gap-1.5 border-b border-slate-800 pb-1.5 sm:pb-2 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 flex items-center justify-center font-mono text-[9px] sm:text-[10px] font-bold shrink-0">
                💬
              </div>
              <h4 className="font-extrabold text-[11px] sm:text-xs text-white leading-tight">
                {speechBubble.title}
              </h4>
            </div>

            <button
              onClick={() => setSpeechBubble((prev) => ({ ...prev, show: false }))}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-300 font-medium">
            {speechBubble.text}
          </p>

          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-pink-300 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> NiuBot CS Guide
            </span>
            <button
              onClick={() => {
                setSpeechBubble((prev) => ({ ...prev, show: false }));
                setIsOpen(true);
                setExpression('excited');
              }}
              className="text-[9px] sm:text-[10px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 hover:underline transition"
            >
              <span>Buka Chat</span>
              <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON - BORDERLESS & MOBILE FRIENDLY */}
      <button
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onTouchEnd={() => setIsBtnHovered(false)}
        onTouchCancel={() => setIsBtnHovered(false)}
        onClick={(e) => {
          if (hasMovedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          setIsOpen(!isOpen);
          if (!isOpen) {
            setExpression('excited');
            setTimeout(() => setExpression('happy'), 1800);
          }
        }}
        onMouseEnter={(e) => {
          if (e.pointerType !== 'touch') {
            setIsBtnHovered(true);
          }
        }}
        onMouseLeave={() => setIsBtnHovered(false)}
        title={isOpen ? "Tahan & geser / Klik untuk tutup" : "Tahan & geser ke posisi mana saja / Klik me untuk buka"}
        className={`group relative p-1 sm:p-1.5 rounded-2xl bg-slate-950 hover:bg-slate-900 shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center touch-none ${isDragging ? 'cursor-grabbing scale-110 ring-2 ring-pink-500/40' : 'cursor-grab'}`}
      >
        <ExpressiveAvatar expression={expression} isMobile={false} isHovered={isBtnHovered} />

        {/* Active Online Pulse Badge */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </button>

    </div>
  );
}
