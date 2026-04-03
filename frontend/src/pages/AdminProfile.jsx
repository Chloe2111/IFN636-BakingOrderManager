import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaUserShield, FaSave, FaKey, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

const AdminProfile = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name:           '',
    email:          '',
    phone:          '',
    profilePicture: '',
    newPassword:    '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name:           user.name           || '',
        email:          user.email          || '',
        phone:          user.phone          || '',
        profilePicture: user.profilePicture || '',
      }));
    }
  }, [user]);

  // ✅ Fixed: /api/auth/profile (not /api/admin/profile)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name:           formData.name,
        phone:          formData.phone,
        profilePicture: formData.profilePicture,
      };
      if (formData.newPassword.trim()) {
        payload.password = formData.newPassword;
      }
      const res = await axiosInstance.put('/api/auth/profile', payload);
      setUser(prev => ({ ...prev, ...res.data }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
      alert('Admin profile updated successfully!');
      setFormData(prev => ({ ...prev, newPassword: '' }));
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Top buttons */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/admin/dashboard')}
                  className="flex items-center gap-2 text-gray-500 hover:text-pink-600 font-bold transition">
            <FaArrowLeft size={14} /> Back to Dashboard
          </button>
          <button onClick={handleLogout}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm text-gray-500 hover:text-red-500 font-bold text-sm transition border border-gray-100">
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-slate-800 p-8 text-white flex items-center space-x-6">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name}
                   className="w-20 h-20 rounded-2xl object-cover border-4 border-pink-500 shadow-lg"
                   onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
            ) : (
              <div className="bg-pink-600 p-4 rounded-2xl"><FaUserShield size={32} /></div>
            )}
            <div>
              <h1 className="text-2xl font-black">{user?.name}</h1>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <span className="text-xs bg-pink-600 px-3 py-1 rounded-full font-bold mt-1 inline-block">
                Administrator
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="p-8 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Display Name</label>
                <input type="text" value={formData.name}
                       onChange={e => setFormData({ ...formData, name: e.target.value })}
                       className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                       required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Admin Email</label>
                <input type="email" value={formData.email}
                       className="w-full p-3 bg-gray-100 border rounded-xl text-gray-400 cursor-not-allowed"
                       disabled />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</label>
              <input type="tel" value={formData.phone}
                     onChange={e => setFormData({ ...formData, phone: e.target.value })}
                     className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Profile Picture URL</label>
              <input type="url" value={formData.profilePicture}
                     onChange={e => setFormData({ ...formData, profilePicture: e.target.value })}
                     placeholder="https://randomuser.me/api/portraits/men/32.jpg"
                     className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
              {formData.profilePicture && (
                <img src={formData.profilePicture} alt="Preview"
                     className="w-12 h-12 rounded-xl object-cover mt-2 border-2 border-pink-200"
                     onError={e => { e.target.style.display = 'none'; }} />
              )}
            </div>

            {/* Password */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center text-pink-600 mb-4 font-bold">
                <FaKey className="mr-2" /> Change Password (optional)
              </div>
              <input type="password" placeholder="Enter new password (leave blank to keep current)"
                     value={formData.newPassword}
                     onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                     className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
            </div>

            <button type="submit" disabled={saving}
                    className={`w-full py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2
                      ${saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-pink-600'}`}>
              <FaSave />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
