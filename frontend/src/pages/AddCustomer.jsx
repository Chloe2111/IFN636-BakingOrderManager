import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft, FaUserCircle, FaSave } from 'react-icons/fa';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    gender: 'Other',
    country: 'Australia'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to create customer in MongoDB
      await axiosInstance.post('/api/admin/customers', formData);
      alert('New customer profile created successfully!');
      navigate('/admin/customers'); 
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create customer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/admin/customers')} className="mr-4 hover:text-pink-400 transition">
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">Add New Customer</h1>
          </div>
          <FaUserCircle size={30} className="text-slate-400" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Profile Image Placeholder */}
          <div className="flex flex-col items-center pb-6 border-b border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2 border-2 border-dashed border-gray-300">
              <span className="text-xs text-center px-2">Upload Photo</span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Customer Avatar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Customer ID</label>
              <input
                type="text"
                placeholder="CUST-2026"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone Number</label>
              <input
                type="tel"
                placeholder="0400 000 000"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Home Address</label>
            <input
              type="text"
              placeholder="123 Bakery Lane, Brisbane QLD"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Password</label>
              <input
                type="password"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Gender</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Other">Other</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Country</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              >
                <option value="Australia">Australia</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transition transform active:scale-95 flex items-center justify-center"
          >
            <FaSave className="mr-2" /> Create Customer Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;