import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AddCustomer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/api/auth/register', {
        ...formData,
        role: 'customer',
      });

      alert('Customer created successfully!');
      navigate('/admin/customers');

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow">

        <h1 className="text-2xl font-black mb-6">Add New Customer</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-3 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700"
          >
            {loading ? 'Creating...' : 'Create Customer'}
          </button>

        </form>

        <button
          onClick={() => navigate('/admin/customers')}
          className="mt-4 text-gray-500 hover:text-pink-600"
        >
          ← Back to Customer List
        </button>

      </div>
    </div>
  );
};

export default AddCustomer;