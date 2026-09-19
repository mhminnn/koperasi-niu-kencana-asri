import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Newspaper, 
  Handshake, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Upload, 
  Check, 
  AlertCircle,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  Share2,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [token, setToken] = useState(null);

  // States
  const [products, setProducts] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [partners, setPartners] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editItem, setEditItem] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  // Security / Password State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: 'Konfirmasi password baru tidak cocok.', type: 'error' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ text: 'Password baru minimal 6 karakter.', type: 'error' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ text: data.message || 'Password berhasil diperbarui!', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          navigate('/admin/login');
          return;
        }
        setPasswordMessage({ text: data.error || 'Gagal mengubah password.', type: 'error' });
      }
    } catch (err) {
      setPasswordMessage({ text: 'Koneksi server gagal.', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    setToken(adminToken);
    fetchAllData(adminToken);
  }, [navigate]);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchAllData = async (authToken) => {
    setLoading(true);
    try {
      const authHeader = { Authorization: `Bearer ${authToken}` };
      const safeFetch = async (url, opts = {}) => {
        try {
          const res = await fetch(url, opts);
          if (!res.ok) return [];
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        } catch (e) {
          console.error(`Failed fetching ${url}:`, e);
          return [];
        }
      };

      const [pRes, nRes, partnerRes, msgRes, socialRes] = await Promise.all([
        safeFetch('/api/products'),
        safeFetch('/api/news'),
        safeFetch('/api/partners'),
        safeFetch('/api/messages', { headers: authHeader }),
        safeFetch('/api/socials')
      ]);

      setProducts(pRes);
      setNewsList(nRes);
      setPartners(partnerRes);
      setMessages(msgRes);
      setSocials(socialRes);
    } catch (err) {
      showToast('Gagal memuat data dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditItem(null);
    setImageFile(null);

    if (activeTab === 'products') {
      setFormData({ name: '', category: 'Olahan Kelapa', price: 0, description: '', badge: 'Unggulan', image_url: '' });
    } else if (activeTab === 'news') {
      setFormData({ title: '', category: 'Berita', content: '', excerpt: '', date: new Date().toISOString().split('T')[0], image_url: '' });
    } else if (activeTab === 'partners') {
      setFormData({ name: '', website: 'https://', logo_url: '' });
    } else if (activeTab === 'socials') {
      setFormData({ platform: 'Instagram', name: '', handle: '', description: '', url: 'https://', cover_color: 'from-purple-600 via-pink-500 to-amber-500' });
    }
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditItem(item);
    setImageFile(null);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      const endpoint = `/api/${activeTab}/${id}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        showToast('Data berhasil dihapus');
        fetchAllData(token);
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal menghapus data', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const [imageFiles, setImageFiles] = useState([]);

  const handleSubmitModal = async (e) => {
    e.preventDefault();

    if (activeTab === 'socials') {
      try {
        const url = modalMode === 'add' ? '/api/socials' : `/api/socials/${editItem.id}`;
        const method = modalMode === 'add' ? 'POST' : 'PUT';
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          showToast(`Berhasil ${modalMode === 'add' ? 'menambahkan' : 'memperbarui'} media sosial!`);
          setModalOpen(false);
          fetchAllData(token);
        } else {
          const err = await res.json();
          showToast(err.error || 'Gagal menyimpan media sosial', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan koneksi', 'error');
      }
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    if (activeTab === 'news') {
      if (imageFiles && imageFiles.length > 0) {
        Array.from(imageFiles).slice(0, 5).forEach(file => {
          data.append('images', file);
        });
      } else if (imageFile) {
        data.append('images', imageFile);
      }
    } else if (imageFile) {
      if (activeTab === 'partners') {
        data.append('logo', imageFile);
      } else {
        data.append('image', imageFile);
      }
    }

    const url = modalMode === 'add'
      ? `/api/${activeTab}`
      : `/api/${activeTab}/${editItem.id}`;

    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        showToast(`Berhasil ${modalMode === 'add' ? 'menambahkan' : 'perbarui'} data!`);
        setModalOpen(false);
        fetchAllData(token);
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal menyimpan data', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan koneksi server', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-bounce ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <Check className="w-4 h-4 text-emerald-600" />}
          {notification.msg}
        </div>
      )}

      {/* Dashboard Top Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">PANEL ADMINISTRASI</span>
          <h1 className="text-2xl font-black text-slate-900">Sistem Management CRUD</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola konten website Koperasi Niu Kencana Asri secara cepat.</p>
        </div>

        {activeTab !== 'messages' && activeTab !== 'security' && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-pink-600 text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah {activeTab === 'products' ? 'Produk' : activeTab === 'news' ? 'Berita' : activeTab === 'partners' ? 'Logo Mitra' : 'Media Sosial'}
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'products' ? 'bg-pink-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Produk ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'news' ? 'bg-pink-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Newspaper className="w-4 h-4" /> Berita & Kegiatan ({newsList.length})
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'partners' ? 'bg-pink-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Handshake className="w-4 h-4" /> Logo Kolaborasi ({partners.length})
        </button>

        <button
          onClick={() => setActiveTab('socials')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'socials' ? 'bg-pink-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" /> Media Sosial ({socials.length})
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'messages' ? 'bg-pink-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" /> Pesan Masuk ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'security' ? 'bg-pink-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" /> Keamanan & Akun
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image_url || 'https://via.placeholder.com/50'} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{p.description}</div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{p.category}</td>
                    <td className="p-4 font-bold text-slate-900">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 font-bold text-[10px]">{p.badge}</span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(p)} className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-pink-100 hover:text-pink-600 transition">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. NEWS TAB */}
      {activeTab === 'news' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Berita</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {newsList.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={n.image_url || 'https://via.placeholder.com/50'} alt={n.title} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{n.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{n.excerpt || n.content}</div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{n.category}</td>
                    <td className="p-4 text-slate-500">{n.date}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(n)} className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-pink-100 hover:text-pink-600 transition">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PARTNERS LOGO TAB */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((pt) => (
            <div key={pt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col items-center text-center">
              <div className="h-20 flex items-center justify-center p-2 border border-slate-100 rounded-xl w-full bg-slate-50">
                <img src={pt.logo_url} alt={pt.name} className="max-h-16 max-w-full object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{pt.name}</h4>
                <a href={pt.website} target="_blank" rel="noreferrer" className="text-[11px] text-pink-600 hover:underline">{pt.website}</a>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100 w-full justify-center">
                <button onClick={() => openEditModal(pt)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-pink-100 hover:text-pink-600 transition">
                  Edit
                </button>
                <button onClick={() => handleDelete(pt.id)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. SOCIAL MEDIA TAB */}
      {activeTab === 'socials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socials.map((sc) => (
            <div key={sc.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row border border-slate-100 hover:shadow-md transition">
              <div className={`sm:w-2/5 p-5 bg-gradient-to-r ${sc.cover_color || 'from-purple-600 via-pink-500 to-amber-500'} text-white flex flex-col justify-between relative`}>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full w-fit">
                  {sc.platform}
                </span>
                <div className="pt-6">
                  <h4 className="font-black text-white text-base leading-tight">{sc.name}</h4>
                  <p className="text-xs text-white/90 font-semibold mt-0.5">{sc.handle}</p>
                </div>
              </div>
              <div className="sm:w-3/5 p-5 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{sc.description || 'Tidak ada deskripsi'}</p>
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <a href={sc.url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-pink-600 hover:underline flex items-center gap-1">
                    {sc.url} <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(sc)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-pink-100 hover:text-pink-600 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(sc.id)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. MESSAGES INBOX TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                      <span className="text-xs text-slate-400 ml-2">({m.email})</span>
                    </div>
                    <button
                      onClick={async () => {
                        if (window.confirm('Hapus pesan ini?')) {
                          await fetch(`/api/messages/${m.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                          fetchAllData(token);
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-pink-600">Subjek: {m.subject}</div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{m.message}</p>
                  <div className="text-[10px] text-slate-400 text-right">{m.created_at}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">Belum ada pesan masuk dari pengunjung.</div>
          )}
        </div>
      )}

      {/* 5. SECURITY & CHANGE PASSWORD TAB */}
      {activeTab === 'security' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pengaturan Keamanan Admin</h3>
              <p className="text-xs text-slate-500">Ubah password akun admin untuk mencegah akses tanpa izin.</p>
            </div>
          </div>

          {passwordMessage.text && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              passwordMessage.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {passwordMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password Saat Ini</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Masukkan password lama"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password Baru</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Password Baru</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Ulangi password baru"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-pink-600 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {passwordLoading ? 'Menyimpan...' : 'Perbarui Password Admin'}
            </button>
          </form>
        </div>
      )}

      {/* MODAL FOR ADD / EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {modalMode === 'add' ? 'Tambah' : 'Edit'} {activeTab === 'products' ? 'Produk' : activeTab === 'news' ? 'Berita' : 'Logo Mitra'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              
              {/* Product Form Inputs */}
              {activeTab === 'products' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Produk</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Harga (Rp)</label>
                      <input
                        type="number"
                        required
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge Produk</label>
                    <input
                      type="text"
                      placeholder="e.g. Terlaris, Unggulan, Ekspor"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi</label>
                    <textarea
                      rows="3"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* News Form Inputs */}
              {activeTab === 'news' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Berita</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                      <input
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan (Excerpt)</label>
                    <input
                      type="text"
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Isi Konten Lengkap</label>
                    <textarea
                      rows="4"
                      required
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* Partners Form Inputs */}
              {activeTab === 'partners' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Instansi / Mitra</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tautan Website Mitra</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                  </div>
                </>
              )}
              {/* Socials Form Inputs */}
              {activeTab === 'socials' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Platform</label>
                      <select
                        value={formData.platform || 'Instagram'}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="YouTube">YouTube</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Akun</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Koperasi Niu Kencana"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Handle / Username</label>
                      <input
                        type="text"
                        value={formData.handle || ''}
                        onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                        placeholder="e.g. @niukencanaasri"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gradasi Warna Cover</label>
                      <select
                        value={formData.cover_color || 'from-purple-600 via-pink-500 to-amber-500'}
                        onChange={(e) => setFormData({ ...formData, cover_color: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                      >
                        <option value="from-purple-600 via-pink-500 to-amber-500">Instagram (Pink Purple)</option>
                        <option value="from-blue-700 via-blue-600 to-indigo-800">Facebook Blue</option>
                        <option value="from-red-600 via-rose-600 to-red-800">YouTube Red</option>
                        <option value="from-emerald-600 via-teal-600 to-emerald-800">WhatsApp Green</option>
                        <option value="from-slate-900 via-black to-slate-950">TikTok Dark</option>
                        <option value="from-pink-600 to-purple-800">Deep Pink</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tautan / URL Profil Media Sosial</label>
                    <input
                      type="url"
                      required
                      value={formData.url || ''}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://www.instagram.com/niukencanaasri"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                    <textarea
                      rows="2"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Deskripsi singkat..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* Image Input Options */}
              {activeTab !== 'socials' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  {activeTab === 'news' ? 'Unggah Foto (Bisa sampai 5 Foto) / Masukkan URL' : 'Unggah Gambar atau Masukkan URL'}
                </label>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={activeTab === 'news'}
                    onChange={(e) => {
                      if (activeTab === 'news') {
                        setImageFiles(Array.from(e.target.files).slice(0, 5));
                      } else {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  {activeTab === 'news' && imageFiles.length > 0 && (
                    <div className="text-[11px] text-pink-600 font-bold mt-1">
                      ✓ {imageFiles.length} foto dipilih
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 font-bold text-center">— ATAU —</div>

                <div>
                  <input
                    type="text"
                    placeholder={activeTab === 'news' ? "URL Gambar (pisahkan dengan koma jika > 1)" : "URL Gambar (e.g. https://...)"}
                    value={formData.image_url || formData.logo_url || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeTab === 'news') {
                        const urls = val.split(',').map(s => s.trim()).filter(Boolean);
                        setFormData({ 
                          ...formData, 
                          image_url: urls[0] || '',
                          image_urls: JSON.stringify(urls)
                        });
                      } else {
                        setFormData({ ...formData, [activeTab === 'partners' ? 'logo_url' : 'image_url']: val });
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white"
                  />
                </div>
              </div>
              )}

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-pink-600 transition shadow"
                >
                  Simpan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
