import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaUser, FaShoppingBag, FaTrashAlt, FaTruck, FaSignOutAlt, FaSave } from 'react-icons/fa';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  // Load Customer Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/api/orders/my-orders');
        setOrders(res.data);
      } catch (err) { console.error("Error fetching history"); }
    };
    fetchOrders();
  }, []);

  // UPDATE Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/api/users/profile', profileData);
      alert("Profile updated successfully!");
    } catch (err) { alert("Update failed."); }
  };

  // DELETE Account
  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL: Are you sure you want to delete your account? All order history will be lost.")) {
      try {
        await axiosInstance.delete('/api/users/profile');
        logout();
        navigate('/');
      } catch (err) { alert("Could not delete account."); }
    }
  };

  // DELETE (Cancel) Order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Cancel this order?")) {
      try {
        await axiosInstance.delete(`/api/orders/${orderId}`);
        setOrders(orders.filter(o => o._id !== orderId));
        alert("Order cancelled.");
      } catch (err) { alert("Cannot cancel order once it is in 'Baking' status."); }
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-lg p-6">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-3xl font-bold mb-3">
            {user?.name?.charAt(0)}
          </div>
          <h2 className="font-bold text-gray-800">{user?.name}</h2>
          <p className="text-xs text-gray-400 italic">Valued Customer</p>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center p-3 rounded-xl font-bold transition ${activeTab === 'orders' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-500 hover:bg-pink-50'}`}
          >
            <FaShoppingBag className="mr-3" /> My Orders
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center p-3 rounded-xl font-bold transition ${activeTab === 'profile' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-500 hover:bg-pink-50'}`}
          >
            <FaUser className="mr-3" /> Profile Settings
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center p-3 rounded-xl font-bold text-gray-400 hover:text-red-500 transition mt-10"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8">
        {activeTab === 'orders' ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-pink-500 uppercase">Order {order.orderId || '#ORD-99'}</p>
                    <h3 className="font-bold text-gray-800">{order.items?.length} Items — ${order.totalPrice}</h3>
                    <p className="text-sm text-gray-400">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {order.status}
                    </span>
                    <button 
                      onClick={() => navigate(`/order-tracking/${order._id}`)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" title="Track"
                    >
                      <FaTruck className="text-gray-600" />
                    </button>
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100" title="Cancel"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
            <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-3xl shadow-sm space-y-4 border border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                <input 
                  type="text" value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Delivery Address</label>
                <textarea 
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none" rows="3"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transition">
                <FaSave className="inline mr-2" /> Save Profile
              </button>
            </form>

            <div className="mt-10 p-6 bg-red-50 rounded-3xl border border-red-100">
              <h3 className="text-red-800 font-bold mb-2">Danger Zone</h3>
              <p className="text-red-600/60 text-sm mb-4">Deleting your account is permanent and cannot be undone.</p>
              <button 
                onClick={handleDeleteAccount}
                className="text-red-700 font-bold hover:underline"
              >
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