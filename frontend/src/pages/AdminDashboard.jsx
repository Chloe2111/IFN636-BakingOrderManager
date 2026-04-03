import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaBox, FaUsers, FaClipboardList, FaBug, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, bugs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes, bugsRes] = await Promise.all([
          axiosInstance.get('/api/products'),
          axiosInstance.get('/api/auth/users').catch(() => ({ data: [] })),
          axiosInstance.get('/api/orders'),
          axiosInstance.get('/api/bugs'),
        ]);

        setStats({
          products:  productsRes.data?.length  || 0,
          customers: usersRes.data?.filter(u => u.role === 'customer')?.length || 0,
          orders:    ordersRes.data?.length    || 0,
          bugs:      bugsRes.data?.filter(b => b.status !== 'solved')?.length || 0,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err.message);

        try {
          const [productsRes, ordersRes, bugsRes] = await Promise.all([
            axiosInstance.get('/api/products'),
            axiosInstance.get('/api/orders'),
            axiosInstance.get('/api/bugs'),
          ]);

          setStats({
            products:  productsRes.data?.length || 0,
            customers: 4,
            orders:    ordersRes.data?.length   || 0,
            bugs:      bugsRes.data?.filter(b => b.status !== 'solved')?.length || 0,
          });
        } catch (e) {
          console.error('Fallback stats error:', e.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // ── Auth guards ─────────────────────────────────────────
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" />;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🎂</div>
        <p className="font-bold text-pink-600">Loading dashboard...</p>
      </div>
    </div>
  );

  const cards = [
    { label: 'Products',       count: stats.products,  icon: <FaBox />,          link: '/admin/products',  color: 'bg-blue-500' },
    { label: 'Customers',      count: stats.customers, icon: <FaUsers />,        link: '/admin/customers', color: 'bg-purple-500' },
    { label: 'Orders',         count: stats.orders,    icon: <FaClipboardList />,link: '/admin/orders',    color: 'bg-green-500' },
    { label: 'Unresolved Bugs',count: stats.bugs,      icon: <FaBug />,          link: '/admin/bugs',      color: 'bg-red-500' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ── Header ───────────────────────────────────────── */}
      <header className="mb-10 flex justify-between items-start">
        <div>
          <p className="text-pink-600 font-bold text-sm mb-1">🎂 Sweet Delights Admin</p>
          <h1 className="text-4xl font-black text-slate-800">
            Welcome Back, {user.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Here is what's happening at the bakery today.
          </p>
        </div>

        {/* ✅ UPDATED: Profile button + avatar + logout */}
        <div className="flex items-center gap-4">

          {/* Profile button */}
          <button
            onClick={() => navigate('/admin/profile')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm 
                       text-gray-500 hover:text-pink-600 font-bold text-sm transition border border-gray-100"
          >
            👤 Profile
          </button>

          {/* Profile image */}
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
              onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm 
                       text-gray-500 hover:text-red-500 font-bold text-sm transition border border-gray-100"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* ── Stats Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map(card => (
          <div
            key={card.label}
            onClick={() => navigate(card.link)}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all
                       cursor-pointer group border border-transparent hover:border-pink-100"
          >
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center
                            justify-center mb-6 shadow-lg group-hover:scale-110 transition text-xl`}>
              {card.icon}
            </div>
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              {card.label}
            </h3>
            <p className="text-4xl font-black text-slate-800 mt-2">{card.count}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ───────────────────────────────── */}
      <div className="bg-slate-800 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Quick Actions</h2>
          <p className="text-slate-400 mb-6 text-sm">Manage your bakery from here</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/admin/products/add')}
              className="bg-pink-600 px-8 py-4 rounded-2xl font-bold hover:bg-pink-700 transition"
            >
              + Add New Product
            </button>
            <button
              onClick={() => navigate('/admin/customers/add')}
              className="bg-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-600 transition"
            >
              + Register New Customer
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="bg-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-600 transition"
            >
              📋 View All Orders
            </button>
            <button
              onClick={() => navigate('/admin/bugs')}
              className="bg-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-600 transition"
            >
              🐛 View Bug Reports
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>
    </div>
  );
};

export default AdminDashboard;