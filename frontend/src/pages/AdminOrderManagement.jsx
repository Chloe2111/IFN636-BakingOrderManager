import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { FaTrash, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/orders');
      setOrders(res.data);
    } catch (err) { console.error("Could not fetch orders"); }
  };

  // UPDATE Logic: Change status in MongoDB
  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/admin/orders/${id}`, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) { alert("Failed to update order status."); }
  };

  // DELETE Logic: Remove order record
  const handleDeleteOrder = async (id) => {
    if (window.confirm("WARNING: This will permanently remove the order record from the database. Proceed?")) {
      try {
        await axiosInstance.delete(`/api/admin/orders/${id}`);
        setOrders(orders.filter(o => o._id !== id));
      } catch (err) { alert("Error deleting record."); }
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || o.orderId?.includes(searchTerm)) &&
    (filter === 'All' || o.status === filter)
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/admin/dashboard')} className="mr-4 p-3 bg-white rounded-xl shadow-sm hover:text-pink-600 transition">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-pink-300 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
          {['All', 'Pending', 'Baking', 'Shipped', 'Delivered'].map(s => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === s ? 'bg-pink-600 text-white shadow-md shadow-pink-200' : 'text-slate-400 hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Total</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition">
                <td className="p-5 font-mono text-sm text-slate-500">{order.orderId || '#ORD-55'}</td>
                <td className="p-5">
                  <p className="font-bold text-slate-800">{order.customerName}</p>
                  <p className="text-[10px] text-slate-400">{order.items?.length || 0} items ordered</p>
                </td>
                <td className="p-5 font-black text-pink-600">${order.totalPrice}</td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase 
                    ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 
                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center justify-center space-x-3">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-slate-100 border-none rounded-lg p-2 text-[10px] font-bold focus:ring-2 focus:ring-pink-300"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Baking">Baking</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
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
          <div className="p-20 text-center text-slate-300">No orders found matching criteria.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderManagement;