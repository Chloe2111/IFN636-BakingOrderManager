import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { FaTrash, FaSearch, FaArrowLeft, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  pending:           'bg-yellow-100 text-yellow-700',
  confirmed:         'bg-blue-100 text-blue-700',
  'in-progress':     'bg-purple-100 text-purple-700',
  ready:             'bg-indigo-100 text-indigo-700',
  delivered:         'bg-green-100 text-green-700',
  cancelled:         'bg-red-100 text-red-700',
  'return-requested':'bg-orange-100 text-orange-700',
};

const AdminOrderManagement = () => {
  const [orders, setOrders]       = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter]       = useState('all');
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, []);

  // ✅ Fixed: correct endpoint /api/orders
  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Could not fetch orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: correct endpoint /api/orders/:id
  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/orders/${id}`, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  // ✅ Fixed: correct endpoint /api/orders/:id
  const handleDeleteOrder = async (id) => {
    if (window.confirm('WARNING: This will permanently cancel the order. Proceed?')) {
      try {
        await axiosInstance.delete(`/api/orders/${id}`);
        setOrders(orders.filter(o => o._id !== id));
      } catch (err) {
        alert('Error deleting order.');
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    // ✅ Fixed: search by customer name from populated field
    const customerName = o.customer?.name?.toLowerCase() || '';
    const orderId      = o._id?.slice(-6).toLowerCase() || '';
    const matchSearch  = customerName.includes(searchTerm.toLowerCase()) ||
                         orderId.includes(searchTerm.toLowerCase());
    const matchFilter  = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  const filterOptions = ['all', 'pending', 'confirmed', 'in-progress', 'ready', 'delivered', 'cancelled'];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-3 bg-white rounded-xl shadow-sm hover:text-pink-600 transition border border-gray-100"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Order Management</h1>
          <p className="text-slate-400 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {/* ── Search + Filter ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
          {filterOptions.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition capitalize whitespace-nowrap
                ${filter === s ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-bold">Loading orders...</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-5 text-xs font-black text-slate-400 uppercase">Order ID</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase">Customer</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase">Items</th>
                {/* ✅ Fixed: totalAmount not totalPrice */}
                <th className="p-5 text-xs font-black text-slate-400 uppercase">Total</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase">Payment</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase text-center">Status</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition">

                  {/* Order ID */}
                  <td className="p-5 font-mono text-sm text-slate-500">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>

                  {/* ✅ Fixed: customer.name from populated field */}
                  <td className="p-5">
                    <p className="font-bold text-slate-800">
                      {order.customer?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-400">{order.customer?.email}</p>
                  </td>

                  {/* Items with images */}
                  <td className="p-5">
                    <div className="flex -space-x-2">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.productImage || 'https://placehold.co/32x32?text=Item'}
                          alt={item.productName}
                          className="w-8 h-8 rounded-lg object-cover border-2 border-white"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/32x32?text=Item'; }}
                          title={item.productName}
                        />
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{order.items?.length} item(s)</p>
                  </td>

                  {/* ✅ Fixed: totalAmount */}
                  <td className="p-5 font-black text-pink-600">
                    ${order.totalAmount?.toFixed(2)}
                  </td>

                  {/* Payment status */}
                  <td className="p-5">
                    <span className="text-xs capitalize text-gray-500">{order.paymentStatus}</span>
                  </td>

                  {/* Status badge */}
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase capitalize
                      ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-2">
                      {/* ✅ Fixed: status values match your DB enum */}
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="bg-slate-100 border-none rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-pink-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="return-requested">Return Requested</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="p-20 text-center text-slate-300 font-bold">
              No orders found matching criteria.
            </div>
          )}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mt-8 flex items-center gap-2 text-gray-400 hover:text-pink-600 font-bold transition"
      >
        <FaHome size={14} /> Back to Dashboard
      </button>
    </div>
  );
};

export default AdminOrderManagement;
