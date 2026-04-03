import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaShoppingCart, FaClipboardList, FaUser, FaShoppingBag } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

// ─── Static category images ───────────────────────────────────────────────────
const categories = [
  { name: 'Cupcakes', img: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200&h=200&fit=crop', filter: 'cupcake' },
  { name: 'Cakes',    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop', filter: 'cake'    },
  { name: 'Donuts',   img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop', filter: 'donut'   },
  { name: 'Brownies', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop', filter: 'brownie' },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch]               = useState('');
  const [products, setProducts]           = useState([]);
  const [saleProducts, setSaleProducts]   = useState([]);
  const [cartCount, setCartCount]         = useState(0);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  // ── Fetch products from DB ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/api/products');
        const all = res.data;
        setProducts(all);
        setSaleProducts(all.filter(p => p.isOnSale));
      } catch (err) {
        console.error('Error loading products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Fetch live cart count ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get('/api/cart');
        setCartCount(res.data?.items?.length || 0);
      } catch (err) {
        console.error('Cart fetch error:', err.message);
      }
    };
    fetchCart();
  }, [user]);

  // ── Filter logic ────────────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory ? p.category === activeCategory : true;
    return matchSearch && matchCategory;
  });

  const popularProducts = filtered.filter(p => p.isPopular);
  const displayProducts = popularProducts.length > 0 ? popularProducts : filtered;

  return (
    <div style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}
         className="min-h-screen bg-[#FFF8F5] pb-24">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#C25B8A] px-6 pt-8 pb-10 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-1">
          <div>
            <p className="text-white/70 text-sm">Welcome back 👋</p>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              Good day, {user?.name?.split(' ')[0] || 'Guest'}
            </h1>
          </div>
          <button onClick={() => navigate('/cart')}
                  className="relative bg-white/20 p-3 rounded-2xl hover:bg-white/30 transition">
            <FaShoppingBag className="text-white" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-[10px] font-bold
                               text-gray-800 rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="mt-4 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search for your favourite treat..."
            className="w-full py-3 pl-10 pr-4 rounded-2xl text-sm text-gray-700 outline-none shadow-sm focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 mt-6 space-y-8">

        {/* ── Categories ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-extrabold text-gray-800 text-base mb-3">Discover by category</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 rounded-2xl shadow-sm border px-4 py-2 text-xs font-bold transition-all
                ${!activeCategory ? 'bg-[#C25B8A] text-white border-[#C25B8A]' : 'bg-white text-gray-700 border-pink-50 hover:shadow-md'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(activeCategory === cat.filter ? null : cat.filter)}
                className={`flex-shrink-0 rounded-2xl shadow-sm border overflow-hidden w-24 transition-all duration-200
                  ${activeCategory === cat.filter ? 'ring-2 ring-[#C25B8A] -translate-y-1' : 'border-pink-50 hover:shadow-md hover:-translate-y-1'}`}
              >
                <img src={cat.img} alt={cat.name} className="w-full h-16 object-cover" />
                <p className="text-xs font-bold text-gray-700 py-2 text-center bg-white">{cat.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Popular Products from DB ──────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-extrabold text-gray-800 text-base">
              {activeCategory ? `${activeCategory}s` : 'Popular cake'}
            </h2>
            <button
              onClick={() => { setSearch(''); setActiveCategory(null); }}
              className="text-[#C25B8A] text-sm font-bold hover:underline"
            >
              See all
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No products found{search ? ` for "${search}"` : ''}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayProducts.map(product => (
                <button
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="relative rounded-2xl overflow-hidden shadow-sm
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left"
                >
                  <img
                    src={product.image || 'https://placehold.co/300x200?text=No+Image'}
                    alt={product.name}
                    className="w-full h-36 object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200?text=No+Image'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {product.isPopular && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-[9px] font-extrabold text-gray-800 px-2 py-0.5 rounded-full">
                      ⭐ Popular
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm leading-tight">{product.name}</p>
                    <p className="text-yellow-300 font-extrabold text-sm mt-0.5">
                      From ${product.basePrice?.toFixed(2) ?? product.priceOptions?.[0]?.price?.toFixed(2) ?? '0.00'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── Sale Products from DB ─────────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-extrabold text-gray-800 text-base">Product on sale</h2>
            <button className="text-[#C25B8A] text-sm font-bold hover:underline">See all</button>
          </div>

          {saleProducts.length === 0 ? (
            <div className="bg-pink-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-pink-800">Buy 3 get 1 free!</p>
                <p className="text-xs text-pink-600">On all Vanilla Cupcakes</p>
              </div>
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Claim</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {saleProducts.map(item => (
                <button
                  key={item._id}
                  onClick={() => navigate(`/products/${item._id}`)}
                  className="relative rounded-2xl overflow-hidden shadow-sm
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left"
                >
                  <img
                    src={item.image || 'https://placehold.co/300x200?text=Sale'}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200?text=Sale'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-extrabold text-sm leading-tight">
                      {item.promotionLabel || item.name}
                    </p>
                    <p className="text-white/75 text-[10px]">
                      From ${item.basePrice?.toFixed(2) ?? '0.00'}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-400 text-[9px] font-extrabold text-gray-800 px-2 py-0.5 rounded-full">
                    SALE
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ── Bottom Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100
                      py-3 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
        {[
          { icon: FaHome,          label: 'Home',    path: '/home'    },
          { icon: FaShoppingCart,  label: 'Cart',    path: '/cart'    },
          { icon: FaClipboardList, label: 'Orders',  path: '/orders'  },
          { icon: FaUser,          label: 'Profile', path: '/profile' },
        ].map(({ icon: Icon, label, path }) => {
          const active = window.location.pathname === path;
          return (
            <button key={label} onClick={() => navigate(path)}
                    className={`flex flex-col items-center transition-colors ${active ? 'text-[#C25B8A]' : 'text-gray-400 hover:text-[#C25B8A]'}`}>
              <Icon size={20} />
              <span className="text-[10px] mt-1 font-bold">{label}</span>
              {active && <span className="w-1 h-1 bg-[#C25B8A] rounded-full mt-0.5" />}
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default Home;
