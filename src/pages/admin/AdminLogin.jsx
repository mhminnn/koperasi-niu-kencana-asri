import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, AlertCircle, Leaf } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        navigate('/admin');
      } else {
        setError(data.error || 'Login gagal.');
      }
    } catch (err) {
      setError('Koneksi server gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-sans py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-3">
          <img
            src="/logo.svg"
            alt="Logo Koperasi Niu Kencana Asri"
            className="w-16 h-16 rounded-full mx-auto shadow-lg shadow-pink-500/20 object-contain"
          />
          <h1 className="text-2xl font-bold text-slate-900">Masuk Portal Admin</h1>
          <p className="text-xs text-slate-500">
            Kelola produk, berita, dan logo kolaborasi Koperasi Niu Kencana Asri.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Username Admin
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Processing...' : 'Masuk sekarang'}
          </button>
        </form>

        <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 text-[11px] text-pink-800 text-center">
          <strong></strong> <strong></strong>
        </div>

      </div>
    </div>
  );
}
