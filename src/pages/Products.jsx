import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Filter, PhoneCall, CheckCircle } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Semua', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = activeCategory === 'Semua'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans space-y-16">
      
      {/* Header Matching Image 2 */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          Produk Unggulan
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Produk Berkualitas <span className="text-pink-500 font-black">Niu Kencana</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Kami menghadirkan produk turunan kelapa terbaik yang diolah dengan prinsip berkelanjutan untuk mendukung gaya hidup sehat dan pertanian modern.
        </p>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div className="h-52 bg-slate-100 overflow-hidden relative">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'}
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'; }}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600">
                    {product.category || 'Umum'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-0.5 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Harga</div>
                    <div className="text-base font-extrabold text-slate-900">
                      Rp {Number(product.price || 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <a
                    href={`https://api.whatsapp.com/send?phone=6285395477026&text=${encodeURIComponent(`Halo Koperasi Niu Kencana Asri, saya berminat memesan produk: ${product.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-pink-600 text-xs font-bold transition-all duration-300 shadow hover:shadow-md hover:scale-105 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Pesan via WA
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-sm">
          Belum ada produk dalam kategori ini.
        </div>
      )}

      {/* Wholesale Banner Matching Image 2 */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Butuh Penawaran Khusus atau Grosir?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Koperasi kami melayani pembelian dalam jumlah besar untuk industri kuliner, reseller, maupun kebutuhan perkebunan skala luas.
          </p>
          <div className="pt-4">
            <Link
              to="/kontak"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-slate-900 hover:bg-pink-50 hover:text-pink-600 font-bold text-sm transition shadow-lg hover:shadow-white/20"
            >
              Hubungi Kami Sekarang
            </Link>
          </div>
        </div>
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

    </div>
  );
}
