import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { FaUserShield, FaSave, FaKey } from 'react-icons/fa';

const AdminProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/api/admin/profile', formData);
      alert("Admin profile updated successfully!");
    } catch (err) {
      alert("Update failed. Check your current password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-slate-800 p-8 text-white flex items-center space-x-4">
          <div className="bg-pink-600 p-4 rounded-2xl">
            <FaUserShield size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Settings</h1>
            <p className="text-slate-400 text-sm">Manage your administrative credentials</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Display Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Admin Email</label>
              <input 
                type="email" 
                value={formData.email}
                className="w-full p-3 bg-gray-100 border rounded-xl text-gray-500 cursor-not-allowed" 
                disabled 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center text-pink-600 mb-4 font-bold">
              <FaKey className="mr-2" /> Change Password
            </div>
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="Current Password"
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
              />
              <input 
                type="password" 
                placeholder="New Password"
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition flex items-center justify-center">
            <FaSave className="mr-2" /> Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;