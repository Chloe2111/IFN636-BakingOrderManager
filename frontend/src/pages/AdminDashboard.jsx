import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { 
  FaUser, FaShoppingBag, FaTrashAlt, FaTruck, 
  FaSignOutAlt, FaSave, FaBug, FaCamera 
} from 'react-icons/fa';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  
  // States
  const [orders, setOrders] = useState([]);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Other',
    nationality: user?.nationality || 'Australian'
  });
  
  const [bugReport, setBugReport] = useState({ title: '', description: '', severity: 'Low' });

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/api/orders/my-orders');
      setOrders(res.data);
    } catch (err) { console.error("Error fetching history"); }
  };

  // CRUD: UPDATE Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/api/auth/profile', profileData);
      alert("Profile updated successfully!");
    } catch (err) { alert("Update failed."); }
  };

  // CRUD: DELETE Account
  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL: Delete your account permanently?")) {
      try {
        await axiosInstance.delete('/api/users/profile');
        logout();
        navigate('/');
      } catch (err) { alert("Could not delete account."); }
    }
  };

  // CRUD: CREATE Bug Report
  const handleSumbitBug = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/bugs', bugReport);
      alert("Thank you! Our bakers... er, developers are on it.");
      setBugReport({ title: '', description: '', severity: 'Low' });
    } catch (err) { alert("Failed to send report."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white shadow-xl p-8 flex flex-col">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative group">
            <div className="w-24 h-24 bg-pink-100 rounded-full border-4 border-white shadow-md overflow-hidden mb-4">
              <img 
                src={user?.profilePic || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-4 right-0 bg-pink-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition">
              <FaCamera size={12} />
            </button>
          </div>
          <h2 className="font-bold text-xl text-slate-800">{profileData.name}</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Bakery Member</p>
        </div>

        <nav className="space-y-3 flex-1">
          {[
            { id: 'orders', label: 'My Orders', icon: <FaShoppingBag /> },
            { id: 'profile', label: 'Profile Settings', icon: <FaUser /> },
            { id: 'bugs', label: 'Report a Bug', icon: <FaBug /> },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-pink-50 hover:text-pink-600'}`}
            >
              <span className="mr-4">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={logout} className="mt-8 flex items-center text-slate-400 font-bold hover:text-red-500 transition">
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Order History</h1>
            <div className="grid gap-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-1 rounded-md">Confirmed</span>
                    <h3 className="font-bold text-slate-800 mt-2">Order {order.orderId || '#8821'}</h3>
                    <p className="text-sm text-slate-400">${order.totalPrice} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => navigate(`/order-tracking/${order._id}`)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-800 hover:text-white transition">
                      <FaTruck />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROFILE (Combined with Gender/Nationality) */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Profile Settings</h1>
            <form onSubmit={handleUpdateProfile} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Full Name</label>
                  <input 
                    type="text" value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Nationality</label>
                  <select 
                    value={profileData.nationality}
                    onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
                    className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none"
                  >
                    <option value="Australian">Australian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Gender</label>
                <div className="flex mt-2 space-x-4">
                  {['Female', 'Male', 'Other'].map(g => (
                    <button 
                      key={g} type="button"
                      onClick={() => setProfileData({...profileData, gender: g})}
                      className={`px-6 py-2 rounded-full text-sm font-bold border transition ${profileData.gender === g ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Delivery Address</label>
                <textarea 
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none" rows="3"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-pink-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-pink-200 hover:bg-pink-700 transition transform active:scale-95">
                Save Profile Updates
              </button>
            </form>

            <button onClick={handleDeleteAccount} className="mt-10 text-red-400 text-sm font-bold hover:text-red-600 ml-2">
              Deactivate My Account
            </button>
          </div>
        )}

        {/* TAB: BUG REPORT */}
        {activeTab === 'bugs' && (
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Report a Bug</h1>
            <p className="text-slate-400 mb-8 ml-1">Found a glitch in our bakery app? Let us know!</p>
            
            <form onSubmit={handleSumbitBug} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Issue Title</label>
                <input 
                  type="text" placeholder="e.g., Cart button not working"
                  value={bugReport.title}
                  onChange={(e) => setBugReport({...bugReport, title: e.target.value})}
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Severity</label>
                <select 
                   value={bugReport.severity}
                   onChange={(e) => setBugReport({...bugReport, severity: e.target.value})}
                   className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none"
                >
                  <option value="Low">Low (Visual glich)</option>
                  <option value="Medium">Medium (Annoying)</option>
                  <option value="High">High (Cannot finish order)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Details</label>
                <textarea 
                  placeholder="Describe what happened..."
                  value={bugReport.description}
                  onChange={(e) => setBugReport({...bugReport, description: e.target.value})}
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none" rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition">
                Send Report
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default CustomerDashboard;