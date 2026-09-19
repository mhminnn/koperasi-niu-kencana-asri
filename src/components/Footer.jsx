import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 font-sans pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Logo Koperasi Niu Kencana Asri" 
                className="w-10 h-10 rounded-full shadow-md shadow-pink-500/20 object-contain" 
              />
              <span className="font-extrabold text-slate-900 tracking-tight text-base uppercase">
                KOPERASI NIU<br />KENCANA ASRI
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Koperasi Produsen yang berakar pada pemanfaatan potensi Perhutanan Sosial di Parigi Moutong dengan prinsip ekonomi sirkular dan tata kelola inklusif.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              NAVIGASI
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-pink-600 transition">Beranda</Link>
              </li>
              <li>
                <Link to="/tentang-kami" className="hover:text-pink-600 transition">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/berita" className="hover:text-pink-600 transition">Berita</Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-pink-600 transition">Kontak</Link>
              </li>
              <li>
                <Link to="/produk" className="hover:text-pink-600 transition">Produk Kami</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Location / Google Maps Embed */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              LOKASI KAMI
            </h4>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
              <iframe
                title="Lokasi Koperasi Niu Kencana Asri"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3501.4483968459676!2d120.180108!3d0.247943!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32760bd2dec38f53%3A0xba458f94ceabf0a7!2sNIU%20KENCANA%20ASRI!5e1!3m2!1sid!2sid!4v1789778269761!5m2!1sid!2sid"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-36 grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <a
                href="https://www.google.com/maps/place/NIU+KENCANA+ASRI/@0.247943,120.180108,17z"
                target="_blank"
                rel="noreferrer"
                className="absolute top-2 left-2 bg-white/95 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 shadow flex items-center gap-1 hover:text-pink-600 transition"
              >
                Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 4: Contact details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              KONTAK
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <a href="mailto:niukencana@gmail.com" className="hover:text-pink-600 transition font-medium">
                  niukencana@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <a href="tel:085395477026" className="hover:text-pink-600 transition font-medium">
                  0853-9547-7026
                </a>
              </li>
              <li className="flex items-start gap-3 text-xs leading-relaxed">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>
                  Dusun II Marisa, Desa Sidoan Selatan, Kec. Sidoan, Parigi Moutong, Sulawesi Tengah
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 KOPERASI NIU KENCANA ASRI . All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-600 transition">Syarat & Ketentuan</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
