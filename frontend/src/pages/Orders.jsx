import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingBag, FaTruck, FaHome, FaClipboardList } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

const statusColors = {
  pending:           'bg-yellow-100 text-yellow-700',
  confirmed:         'bg-blue-100 text-blue-700',
  'in-progress':     'bg-purple-100 text-purple-700',
  ready:             'bg-indigo-100 text-indigo-700',
  delivered:         'bg-green-100 text-green-700',
  cancelled:         'bg-red-100 text-red-700',
  'return-requested':'bg-orange-100 text-orange-700',
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ── Fetch customer's orders ───────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/api/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        setError('Could not load orders.');
        console.error('Orders fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">📦</div>
        <p className="text-gray-400 font-bold">Loading your orders...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF8F5] pb-24">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#C25B8A] px-6 pt-8 pb-10 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-4 mb-1">
          <button onClick={() => navigate('/home')}
                  className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition">
            <FaArrowLeft className="text-white" size={16} />
          </button>
          <div>
            <p className="text-white/70 text-sm">Your History</p>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">My Orders</h1>
          </div>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {error && (
        <p className="text-center text-red-400 font-bold py-8">{error}</p>
      )}

      {/* ── Empty State ───────────────────────────────────────────────────── */}
      {!error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <FaShoppingBag className="text-pink-200 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-400 text-sm mb-6">You haven't placed any orders yet!</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-700 transition"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* ── Orders List ──────────────────────────────────────────────────────── */}
      <div className="px-5 mt-6 space-y-4">
        {orders.map(order => (
          <div key={order._id}
               className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Order Header */}
            <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-gray-50">
              <div>
                <p className="text-xs font-bold text-pink-500 uppercase tracking-wide">
                  Order #{order._id?.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-AU', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                statusColors[order.status] || 'bg-gray-100 text-gray-600'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Order Items with pictures */}
            <div className="px-5 py-3 space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.productImage || 'https://placehold.co/60x60?text=Item'}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover border border-pink-50 flex-shrink-0"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60?text=Item'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">{item.productName}</p>
                    <p className="text-xs text-gray-400">
                      {item.size && `${item.size} · `}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-pink-600 text-sm flex-shrink-0">
                    ${item.subtotal?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex justify-between items-center px-5 pb-5 pt-3 border-t border-gray-50">
              <div className="text-xs text-gray-400 space-y-0.5">
                <p className="capitalize">
                  {order.deliveryMethod} · <span className="capitalize">{order.paymentStatus}</span>
                </p>
                {order.deliveryAddress && (
                  <p className="truncate max-w-[180px]">📍 {order.deliveryAddress}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-extrabold text-pink-600">${order.totalAmount?.toFixed(2)}</p>
                </div>
                {/* Track button */}
                <button
                  onClick={() => navigate(`/order-tracking/${order._id}`)}
                  className="bg-pink-600 text-white p-3 rounded-xl hover:bg-pink-700 transition shadow-sm"
                  title="Track Order"
                >
                  <FaTruck size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100
                      py-3 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
        {[
          { icon: FaHome,          label: 'Home',   path: '/home'   },
          { icon: FaShoppingBag,   label: 'Cart',   path: '/cart'   },
          { icon: FaClipboardList, label: 'Orders', path: '/orders' },
        ].map(({ icon: Icon, label, path }) => {
          const active = window.location.pathname === path;
          return (
            <button key={label} onClick={() => navigate(path)}
                    className={`flex flex-col items-center transition-colors ${
                      active ? 'text-[#C25B8A]' : 'text-gray-400 hover:text-[#C25B8A]'
                    }`}>
              <Icon size={20} />
              <span className="text-[10px] mt-1 font-bold">{label}</span>
              {active && <span className="w-1 h-1 bg-[#C25B8A] rounded-full mt-0.5" />}
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default Orders;
