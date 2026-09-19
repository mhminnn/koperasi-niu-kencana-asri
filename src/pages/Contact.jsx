import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Gagal mengirim pesan.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Terjadi kesalahan koneksi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* Dark Hero Header Matching Image 3 */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Kontak Kami
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Punya pertanyaan atau ingin bekerja sama? Jangan ragu untuk menghubungi kami. Kami siap membantu Anda.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-90" />
      </section>

      {/* Main Contact Content Matching Image 3 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Information & Map */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Informasi Kontak</h2>

            <div className="space-y-4">
              
              {/* Email Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <div className="p-3 rounded-xl bg-pink-50 text-pink-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Email</div>
                  <a href="mailto:niukencana@gmail.com" className="text-xs text-slate-600 hover:text-pink-600 transition font-medium">
                    niukencana@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">WhatsApp / Telepon</div>
                  <a href="tel:085395477026" className="text-xs text-slate-600 hover:text-pink-600 transition font-medium">
                    0853-9547-7026
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <div className="p-3 rounded-xl bg-pink-50 text-pink-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Alamat</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dusun II Marisa, Desa Sidoan Selatan, Kec. Sidoan, Parigi Moutong, Sulawesi Tengah, Indonesia
                  </p>
                </div>
              </div>

            </div>

            {/* Embedded Google Map Box */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative group">
              <iframe
                title="Peta Lokasi Niu Kencana Asri"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3501.4483968459676!2d120.180108!3d0.247943!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32760bd2dec38f53%3A0xba458f94ceabf0a7!2sNIU%20KENCANA%20ASRI!5e1!3m2!1sid!2sid!4v1789778269761!5m2!1sid!2sid"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-64 grayscale group-hover:grayscale-0 transition duration-300"
              />
              <a
                href="https://www.google.com/maps/place/NIU+KENCANA+ASRI/@0.247943,120.180108,17z"
                target="_blank"
                rel="noreferrer"
                className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 shadow flex items-center gap-1.5 hover:text-pink-600 transition"
              >
                Buka di Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Kirim Pesan Form Card */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Kirim Pesan</h2>

            {statusMessage && (
              <div
                className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Masukkan nama Anda"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subjek
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Apa yang ingin Anda tanyakan?"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pesan
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="Tuliskan pesan Anda di sini..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Kirim Pesan'}
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
