import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import {
  FaUser, FaShoppingBag, FaTrashAlt, FaTruck,
  FaSignOutAlt, FaSave, FaHome, FaArrowLeft
} from 'react-icons/fa';

const statusColors = {
  pending:           'bg-yellow-100 text-yellow-700',
  confirmed:         'bg-blue-100 text-blue-700',
  'in-progress':     'bg-purple-100 text-purple-700',
  ready:             'bg-indigo-100 text-indigo-700',
  delivered:         'bg-green-100 text-green-700',
  cancelled:         'bg-red-100 text-red-700',
  'return-requested':'bg-orange-100 text-orange-700',
};

const CustomerDashboard = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileData, setProfileData] = useState({
    name:        user?.name        || '',
    email:       user?.email       || '',
    address:     user?.address     || '',
    phone:       user?.phone       || '',
    gender:      user?.gender      || '',
    nationality: user?.nationality || '',
  });

  // ── Fetch Orders ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/api/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err.response?.data || err.message);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  // ── ✅ Logout — clears state + localStorage + redirects to login ──────────
  const handleLogout = () => {
    logout();               // clears user state + localStorage + axios token
    navigate('/login');     // redirect to login page
  };

  // ── Update Profile ────────────────────────────────────────────────────────
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put('/api/auth/profile', profileData);
      setUser(prev => ({ ...prev, ...res.data }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // ── Delete Account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (window.confirm('CRITICAL: Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await axiosInstance.delete('/api/auth/profile');
        logout();
        navigate('/login');
      } catch (err) {
        alert('Could not delete account.');
      }
    }
  };

  // ── Cancel Order ──────────────────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Cancel this order?')) {
      try {
        await axiosInstance.delete(`/api/orders/${orderId}`);
        setOrders(orders.filter(o => o._id !== orderId));
        alert('Order cancelled.');
      } catch (err) {
        alert('Cannot cancel this order.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30 flex flex-col md:flex-row">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-white shadow-lg p-6 flex flex-col">

        {/* Back to Home */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-gray-400 hover:text-pink-600 transition mb-6 font-bold text-sm"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-10">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-pink-200 shadow-md mb-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=f9a8d4&color=9d174d&size=80`;
              }}
            />
          ) : (
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold mb-3 border-4 border-pink-200">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <h2 className="font-bold text-gray-800">{user?.name}</h2>
          <p className="text-xs text-gray-400 italic">Valued Customer</p>
        </div>

        {/* Nav */}
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center p-3 rounded-xl font-bold transition ${
              activeTab === 'orders' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-500 hover:bg-pink-50'
            }`}
          >
            <FaShoppingBag className="mr-3" /> My Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center p-3 rounded-xl font-bold transition ${
              activeTab === 'profile' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-500 hover:bg-pink-50'
            }`}
          >
            <FaUser className="mr-3" /> Profile Settings
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full flex items-center p-3 rounded-xl font-bold text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition"
          >
            <FaHome className="mr-3" /> Home
          </button>
        </nav>

        {/* ✅ Logout button — now redirects to /login */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-xl font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition mt-4"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 p-8">

        {/* ── Orders Tab ───────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>

            {loadingOrders ? (
              <p className="text-gray-400 text-center py-12">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                <FaShoppingBag className="mx-auto text-pink-200 mb-4" size={48} />
                <p className="text-gray-400 font-bold">No orders yet</p>
                <button
                  onClick={() => navigate('/home')}
                  className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-pink-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-pink-500 uppercase tracking-wide">
                          Order #{order._id?.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Placed: {new Date(order.createdAt).toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                        <button
                          onClick={() => navigate(`/order-tracking/${order._id}`)}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                          title="Track Order"
                        >
                          <FaTruck className="text-gray-600" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100"
                            title="Cancel Order"
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Items with pictures */}
                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.productImage || `https://placehold.co/60x60?text=${encodeURIComponent(item.productName || 'Item')}`}
                            alt={item.productName}
                            className="w-12 h-12 rounded-xl object-cover border border-pink-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/60x60?text=Item';
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-800">{item.productName}</p>
                            <p className="text-xs text-gray-400">
                              {item.size && `${item.size} · `}Qty: {item.quantity} · ${item.unitPrice?.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-bold text-pink-600 text-sm">${item.subtotal?.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-400 space-y-0.5">
                        <p>Delivery: {order.deliveryMethod} · Payment: <span className="capitalize">{order.paymentStatus}</span></p>
                        {order.deliveryAddress && <p>📍 {order.deliveryAddress}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="font-extrabold text-pink-600 text-lg">${order.totalAmount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Profile Tab ──────────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

            {/* Profile picture preview */}
            {user?.profilePicture && (
              <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-pink-200"
                />
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-3xl shadow-sm space-y-4 border border-gray-100">
              {[
                { label: 'Full Name',   key: 'name',        type: 'text' },
                { label: 'Phone',       key: 'phone',       type: 'tel'  },
                { label: 'Gender',      key: 'gender',      type: 'text' },
                { label: 'Nationality', key: 'nationality', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{label}</label>
                  <input
                    type={type}
                    value={profileData[key]}
                    onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Delivery Address</label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transition"
              >
                <FaSave className="inline mr-2" /> Save Profile
              </button>
            </form>

            {/* Danger Zone */}
            <div className="mt-10 p-6 bg-red-50 rounded-3xl border border-red-100">
              <h3 className="text-red-800 font-bold mb-2">Danger Zone</h3>
              <p className="text-red-600/60 text-sm mb-4">Deleting your account is permanent and cannot be undone.</p>
              <button onClick={handleDeleteAccount} className="text-red-700 font-bold hover:underline">
                Delete my account permanently
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
