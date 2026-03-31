import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaShoppingCart, FaClipboardList, FaUser } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth(); // To get "Alice"
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const categories = [
    { name: 'Cupcakes', icon: '🧁' },
    { name: 'Cakes', icon: '🎂' },
    { name: 'Brownies', icon: '🍫' },
    { name: 'Donuts', icon: '🍩' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header & Personalized Greeting */}
      <div className="bg-pink-600 p-6 rounded-b-3xl text-white shadow-lg">
        <h1 className="text-2xl font-bold italic">Sweet Delights</h1>
        <p className="mt-4 text-lg">Good day, {user?.name || 'Alice'}.</p>
        
        {/* Big Search Bar */}
        <div className="mt-4 relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search for your favorite treat..." 
            className="w-full p-3 pl-12 rounded-xl text-black outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Discover by Category */}
      <div className="p-6">
        <h2 className="font-bold text-gray-800 mb-4">Discover by category</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <div key={cat.name} className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm text-center w-24 border border-pink-50">
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-xs font-semibold mt-2">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Sections */}
      <div className="px-6 space-y-6">
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">Product on sale</h2>
            <button className="text-pink-600 text-sm font-bold">See all</button>
          </div>
          <div className="bg-pink-100 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-pink-800">Buy 3 get 1 free!</p>
              <p className="text-xs text-pink-600">On all Vanilla Cupcakes</p>
            </div>
            <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Claim</button>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-3">Popular cake</h2>
          <div className="bg-white p-3 rounded-2xl shadow-sm flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div>
              <h3 className="font-bold text-sm">Triple Chocolate Blast</h3>
              <p className="text-xs text-gray-500">⭐ 4.9 (120 reviews)</p>
              <p className="text-pink-600 font-bold mt-1">$45.00</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4 flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigate('/home')} className="text-pink-600 flex flex-col items-center">
          <FaHome size={20} /><span className="text-[10px] mt-1 font-bold">Home</span>
        </button>
        <button onClick={() => navigate('/cart')} className="text-gray-400 flex flex-col items-center hover:text-pink-600">
          <FaShoppingCart size={20} /><span className="text-[10px] mt-1 font-bold">Cart</span>
        </button>
        <button onClick={() => navigate('/orders')} className="text-gray-400 flex flex-col items-center hover:text-pink-600">
          <FaClipboardList size={20} /><span className="text-[10px] mt-1 font-bold">Orders</span>
        </button>
        <button onClick={() => navigate('/profile')} className="text-gray-400 flex flex-col items-center hover:text-pink-600">
          <FaUser size={20} /><span className="text-[10px] mt-1 font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Home;