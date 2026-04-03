import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft, FaUserCheck } from 'react-icons/fa';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [formData, setFormData] = useState({
    name:           '',
    email:          '',
    phone:          '',
    address:        '',
    gender:         '',
    nationality:    '',
    profilePicture: '',
  });

  // ✅ Fetch from /api/auth/users/:id
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axiosInstance.get(`/api/auth/users/${id}`);
        const u = res.data;
        setFormData({
          name:           u.name           || '',
          email:          u.email          || '',
          phone:          u.phone          || '',
          address:        u.address        || '',
          gender:         u.gender         || '',
          nationality:    u.nationality    || '',
          profilePicture: u.profilePicture || '',
        });
      } catch (err) {
        alert('Could not load customer: ' + (err.response?.data?.message || err.message));
        navigate('/admin/customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handle = (field) => (e) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  // ✅ Update via /api/auth/users/:id
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/api/auth/users/${id}`, formData);
      alert('Customer profile updated!');
      navigate('/admin/customers');
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400 font-bold">Loading customer...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/admin/customers')}
            className="text-gray-400 hover:text-pink-600 transition"
          >
            <FaArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-black text-gray-800">Edit Customer</h1>
        </div>

        {/* Profile picture preview */}
        {formData.profilePicture && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            <img
              src={formData.profilePicture}
              alt={formData.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
              onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
            <div>
              <p className="font-bold text-gray-800">{formData.name}</p>
              <p className="text-xs text-gray-400">{formData.email}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Profile picture URL */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Profile Picture URL</label>
            <input
              type="url"
              value={formData.profilePicture}
              onChange={handle('profilePicture')}
              placeholder="https://example.com/photo.jpg"
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={handle('name')}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handle('email')}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handle('phone')}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={handle('gender')}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">Select...</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nationality</label>
            <select
              value={formData.nationality}
              onChange={handle('nationality')}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="">Select...</option>
              <option value="Australian">Australian</option>
              <option value="Chinese">Chinese</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Indian">Indian</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Delivery Address</label>
            <textarea
              value={formData.address}
              onChange={handle('address')}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center mt-2 transition
              ${saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-pink-600'}`}
          >
            <FaUserCheck className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
