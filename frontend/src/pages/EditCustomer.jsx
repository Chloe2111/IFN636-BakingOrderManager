import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft, FaUserCheck } from 'react-icons/fa';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await axiosInstance.get(`/api/admin/customers/${id}`);
      setFormData(res.data);
    };
    fetchCustomer();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/admin/customers/${id}`, formData);
      alert("Customer profile updated!");
      navigate('/admin/customers');
    } catch (err) { alert("Failed to update customer."); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
        <button onClick={() => navigate(-1)} className="mb-4 text-gray-400 flex items-center"><FaArrowLeft className="mr-2"/> Cancel</button>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Customer Info</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
          <input 
            type="text" value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
          <input 
            type="text" value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <label className="text-xs font-bold text-gray-400 uppercase">Delivery Address</label>
          <textarea 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center mt-6">
            <FaUserCheck className="mr-2"/> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;