import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard, Menu, X, Leaf } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdminLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Berita', path: '/berita' },
    { name: 'Kontak', path: '/kontak' },
    { name: 'Produk', path: '/produk' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo matching reference images */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.svg" 
            alt="Logo Koperasi Niu Kencana Asri" 
            className="w-11 h-11 rounded-full shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform object-contain" 
          />
          <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base leading-tight uppercase font-sans">
            KOPERASI NIU KENCANA ASRI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors duration-200 relative py-1 ${
                isActive(link.path)
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f42db7] rounded-full animate-fade-in" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Admin Login Button */}
        <div className="hidden md:flex items-center gap-3">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#f42db7] text-white text-xs font-bold hover:bg-pink-700 transition shadow-md shadow-pink-500/20"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
              <button
                onClick={handleLogout}
                title="Keluar Admin"
                className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#18181b] text-white text-xs font-bold hover:bg-slate-800 transition shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100/80 active:scale-95 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <div className={`transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`}>
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#f42db7]" /> : <Menu className="w-6 h-6" />}
            </div>
          </button>
        </div>
      </div>

      {/* Smooth Animated Mobile Menu */}
      <div
        className={`md:hidden grid transition-all duration-300 ease-in-out border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-xl overflow-hidden ${
          isMobileMenuOpen
            ? 'grid-rows-[1fr] opacity-100 py-3'
            : 'grid-rows-[0fr] opacity-0 py-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden px-4 space-y-2">
          {navLinks.map((link, idx) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ transitionDelay: `${isMobileMenuOpen ? idx * 40 : 0}ms` }}
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 transform ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
              } ${
                isActive(link.path)
                  ? 'bg-pink-50 text-[#f42db7] font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div 
            style={{ transitionDelay: `${isMobileMenuOpen ? navLinks.length * 40 : 0}ms` }}
            className={`pt-3 pb-2 border-t border-slate-100 transition-all duration-300 transform ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          >
            {isAdminLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#f42db7] text-white font-bold text-xs hover:bg-pink-600 transition shadow-md shadow-pink-500/20 active:scale-98"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 text-rose-600 font-bold text-xs hover:bg-rose-50 transition active:scale-98"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Admin
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#18181b] text-white font-bold text-xs hover:bg-slate-800 transition shadow-md active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                Masuk Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
