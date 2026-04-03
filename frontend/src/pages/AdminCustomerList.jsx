import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import {
  FaUserPlus, FaSearch, FaTrash, FaEdit,
  FaArrowLeft, FaHome
} from 'react-icons/fa';

const AdminCustomerList = () => {
  const [customers, setCustomers]     = useState([]);
  const [searchTerm, setSearchTerm]   = useState('');
  const [loading, setLoading]         = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch from /api/auth/users (users collection) filtered by role=customer
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/users');
        // Filter only customers, not admins
        setCustomers(res.data.filter(u => u.role === 'customer'));
      } catch (err) {
        console.error('Fetch failed:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // ✅ Soft delete via /api/auth/users/:id
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosInstance.delete(`/api/auth/users/${deleteTarget._id}`);
      setCustomers(customers.filter(c => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-8 bg-gray-50 min-h-screen">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm
                         text-gray-500 hover:text-pink-600 font-bold text-sm transition border border-gray-100"
            >
              <FaArrowLeft size={12} /> Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Customer Management</h1>
              <p className="text-slate-400 text-sm">{customers.length} customers registered</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/customers/add')}
            className="bg-pink-600 text-white px-5 py-3 rounded-xl flex items-center font-bold hover:bg-pink-700 transition shadow-sm"
          >
            <FaUserPlus className="mr-2" /> Add Customer
          </button>
        </div>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <div className="relative mb-6 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 text-sm"
          />
        </div>

        {/* ── Table ────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 font-bold">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-bold">No customers found</div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase">Photo</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase">Full Name</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase">Email</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase">Phone</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase">Address</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(customer => (
                  <tr key={customer._id} className="hover:bg-pink-50/30 transition">

                    {/* ✅ Profile picture */}
                    <td className="p-5">
                      {customer.profilePicture ? (
                        <img
                          src={customer.profilePicture}
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-pink-100"
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=f9a8d4&color=9d174d&size=40`;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                          {customer.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="p-5 font-bold text-gray-800">{customer.name}</td>

                    {/* Email */}
                    <td className="p-5 text-sm text-gray-500">{customer.email}</td>

                    {/* Phone */}
                    <td className="p-5 text-sm text-gray-500">{customer.phone || '—'}</td>

                    {/* Address */}
                    <td className="p-5 text-sm text-gray-500 max-w-[180px] truncate">
                      {customer.address || '—'}
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/customers/edit/${customer._id}`)}
                          className="p-2 bg-amber-50 text-amber-500 rounded-lg hover:bg-amber-100 transition"
                          title="Edit Customer"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(customer)}
                          className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition"
                          title="Delete Customer"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back to dashboard */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mt-8 flex items-center gap-2 text-gray-400 hover:text-pink-600 font-bold transition"
        >
          <FaHome size={14} /> Back to Dashboard
        </button>
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-black text-gray-800 mb-2">Delete Customer?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCustomerList;
