import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaShoppingCart, FaClipboardList, FaUser, FaShoppingBag } from 'react-icons/fa';

// ─── Image URLs (free, no download needed) ───────────────────────────────────
const IMAGES = {
  // Category icons
  cupcake:  'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200&h=200&fit=crop',
  cake:     'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
  brownie:  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop',
  donut:    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop',

  // Popular cakes
  strawberryCake: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
  chocolateCake:  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  vanillaCake:    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
  redVelvet:      'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400&h=300&fit=crop',

  // Sale items
  saleBrownie:  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=250&fit=crop',
  saleCookies:  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=250&fit=crop',

  // Banner
  banner: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=300&fit=crop',
};

const categories = [
  { name: 'Cupcakes', img: IMAGES.cupcake },
  { name: 'Cakes',    img: IMAGES.cake    },
  { name: 'Donuts',   img: IMAGES.donut   },
  { name: 'Brownies', img: IMAGES.brownie },
];

const popularCakes = [
  { id: 1, name: 'Strawberry Cake',  price: '$45.00', rating: '⭐ 4.9', reviews: '120 reviews', img: IMAGES.strawberryCake },
  { id: 2, name: 'Chocolate Cake',   price: '$42.00', rating: '⭐ 4.8', reviews: '98 reviews',  img: IMAGES.chocolateCake  },
  { id: 3, name: 'Vanilla Delight',  price: '$38.00', rating: '⭐ 4.7', reviews: '74 reviews',  img: IMAGES.vanillaCake    },
  { id: 4, name: 'Red Velvet Dream', price: '$50.00', rating: '⭐ 4.9', reviews: '145 reviews', img: IMAGES.redVelvet      },
];

const saleItems = [
  { id: 1, label: 'Buy 3 get 1 free!', sub: 'On all Brownies',      img: IMAGES.saleBrownie },
  { id: 2, label: '$20 for 12 cookies', sub: 'Limited time offer',  img: IMAGES.saleCookies },
];

// ─── Component ───────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cartCount] = useState(2); // replace with real cart state

  const filtered = popularCakes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}
         className="min-h-screen bg-[#FFF8F5] pb-24">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#C25B8A] px-6 pt-8 pb-10 rounded-b-[2.5rem] shadow-lg">
        {/* Top row */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <p className="text-white/70 text-sm">Welcome back 👋</p>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              Good day, {user?.name?.split(' ')[0] || 'Alice'}
            </h1>
          </div>
          {/* Cart badge */}
          <button onClick={() => navigate('/cart')}
                  className="relative bg-white/20 p-3 rounded-2xl hover:bg-white/30 transition">
            <FaShoppingBag className="text-white" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-[10px] font-bold text-gray-800 rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
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

        {/* ── Discover by Category ─────────────────────────────────────────── */}
        <section>
          <h2 className="font-extrabold text-gray-800 text-base mb-3">Discover by category</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button key={cat.name}
                      className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-pink-50
                                 hover:shadow-md hover:-translate-y-1 transition-all duration-200
                                 overflow-hidden w-24">
                <img src={cat.img} alt={cat.name}
                     className="w-full h-16 object-cover" />
                <p className="text-xs font-bold text-gray-700 py-2 text-center">{cat.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Popular Cakes ────────────────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-extrabold text-gray-800 text-base">Popular cake</h2>
            <button className="text-[#C25B8A] text-sm font-bold hover:underline">See all</button>
          </div>

          {/* 2-column grid matching the mockup */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(cake => (
              <button key={cake.id}
                      className="relative rounded-2xl overflow-hidden shadow-sm
                                 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left">
                <img src={cake.img} alt={cake.name}
                     className="w-full h-36 object-cover" />
                {/* Dark overlay + text at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm leading-tight">{cake.name}</p>
                  <p className="text-white/80 text-[10px]">{cake.rating} ({cake.reviews})</p>
                  <p className="text-yellow-300 font-extrabold text-sm mt-0.5">{cake.price}</p>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No cakes found for "{search}"</p>
          )}
        </section>

        {/* ── Product on Sale ──────────────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-extrabold text-gray-800 text-base">Product on sale</h2>
            <button className="text-[#C25B8A] text-sm font-bold hover:underline">See all</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {saleItems.map(item => (
              <button key={item.id}
                      className="relative rounded-2xl overflow-hidden shadow-sm
                                 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left">
                <img src={item.img} alt={item.label}
                     className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-extrabold text-sm leading-tight">{item.label}</p>
                  <p className="text-white/75 text-[10px]">{item.sub}</p>
                </div>
                {/* Sale badge */}
                <div className="absolute top-2 right-2 bg-yellow-400 text-[9px] font-extrabold
                                text-gray-800 px-2 py-0.5 rounded-full">
                  SALE
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>{/* end px-5 */}

      {/* ── Bottom Navigation ────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100
                      py-3 flex justify-around items-center
                      shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
        {[
          { icon: FaHome,          label: 'Home',   path: '/home'    },
          { icon: FaShoppingCart,  label: 'Cart',   path: '/cart'    },
          { icon: FaClipboardList, label: 'Orders', path: '/orders'  },
          { icon: FaUser,          label: 'Profile',path: '/profile' },
        ].map(({ icon: Icon, label, path }) => {
          const active = window.location.pathname === path;
          return (
            <button key={label}
                    onClick={() => navigate(path)}
                    className={`flex flex-col items-center transition-colors ${
                      active ? 'text-[#C25B8A]' : 'text-gray-400 hover:text-[#C25B8A]'
                    }`}>
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
