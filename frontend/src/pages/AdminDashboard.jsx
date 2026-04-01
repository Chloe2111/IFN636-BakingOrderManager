import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaBox, FaUsers, FaClipboardList, FaBug } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, bugs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a logged-in admin
    if (user && user.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  // 1. Wait for Auth to check if user is logged in
  if (authLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Verifying Identity...</div>;

  // 2. Security: If not an admin, kick them to the admin login page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  // 3. Loading state for Data
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-pink-600">Baking Dashboard Data...</div>;

  const cards = [
    { label: 'Products', count: stats.products, icon: <FaBox />, link: '/admin/products', color: 'bg-blue-500' },
    { label: 'Customers', count: stats.customers, icon: <FaUsers />, link: '/admin/customers', color: 'bg-purple-500' },
    { label: 'Orders', count: stats.orders, icon: <FaClipboardList />, link: '/admin/orders', color: 'bg-green-500' },
    { label: 'Unresolved Bugs', count: stats.bugs, icon: <FaBug />, link: '/admin/bugs', color: 'bg-red-500' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-800">Welcome Back, {user.name}</h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">Here is what's happening at the bakery today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <div 
            key={card.label}
            onClick={() => navigate(card.link)}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-pink-100"
          >
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition`}>
              {card.icon}
            </div>
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">{card.label}</h3>
            <p className="text-4xl font-black text-slate-800 mt-2">{card.count}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-800 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/admin/products/add')} className="bg-pink-600 px-8 py-4 rounded-2xl font-bold hover:bg-pink-700 transition">Add New Product</button>
            <button onClick={() => navigate('/admin/customers/add')} className="bg-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-600 transition">Register New Customer</button>
          </div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default AdminDashboard;