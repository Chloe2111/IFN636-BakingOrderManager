import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaCheckCircle, FaUtensils,
  FaTruck, FaHome, FaClock, FaTimesCircle, FaBoxOpen
} from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

// ── Map your DB status values to timeline steps ───────────────────────────────
const getSteps = (currentStatus) => {
  const allSteps = [
    { key: 'pending',     label: 'Order Placed',  icon: <FaCheckCircle />, desc: 'Your order has been received' },
    { key: 'confirmed',   label: 'Confirmed',     icon: <FaBoxOpen />,     desc: 'Order confirmed by the bakery' },
    { key: 'in-progress', label: 'Baking',        icon: <FaUtensils />,    desc: 'Being freshly baked for you' },
    { key: 'ready',       label: 'Ready',         icon: <FaClock />,       desc: 'Ready for pickup or dispatch' },
    { key: 'delivered',   label: 'Delivered',     icon: <FaTruck />,       desc: 'Delivered to your door' },
  ];

  const statusOrder = ['pending', 'confirmed', 'in-progress', 'ready', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return allSteps.map((step, index) => ({
    ...step,
    status: index < currentIndex
      ? 'completed'
      : index === currentIndex
        ? 'current'
        : 'pending',
  }));
};

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  // ── Fetch order by ID ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError('Could not load order details.');
        console.error('Order fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🚚</div>
        <p className="text-gray-400 font-bold">Loading order...</p>
      </div>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="text-center">
        <FaTimesCircle className="text-red-300 mx-auto mb-4" size={48} />
        <p className="text-red-400 font-bold mb-4">{error || 'Order not found'}</p>
        <button onClick={() => navigate('/orders')}
                className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold">
          Back to Orders
        </button>
      </div>
    </div>
  );

  const steps = getSteps(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Top Buttons ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6 max-w-lg mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="bg-white p-3 rounded-2xl shadow-sm text-gray-600 hover:text-pink-600 transition"
        >
          <FaArrowLeft size={18} />
        </button>

        {/* ✅ Home button */}
        <button
          onClick={() => navigate('/home')}
          className="bg-[#C25B8A] text-white px-5 py-2 rounded-2xl font-bold flex items-center gap-2 shadow-md hover:bg-pink-700 transition"
        >
          <FaHome size={14} /> Home
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg mx-auto">

        {/* ── Order Header ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-800">Track Order</h1>
          <p className="text-gray-400 text-sm mt-1">
            Order #{order._id?.slice(-6).toUpperCase()}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            Placed: {new Date(order.createdAt).toLocaleDateString('en-AU', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>

        {/* ── Cancelled State ───────────────────────────────────────────────── */}
        {isCancelled ? (
          <div className="text-center py-8">
            <FaTimesCircle className="text-red-400 mx-auto mb-3" size={48} />
            <p className="font-bold text-red-500 text-lg">Order Cancelled</p>
            <p className="text-gray-400 text-sm mt-1">This order has been cancelled.</p>
          </div>
        ) : (
          /* ── Timeline Stepper ─────────────────────────────────────────────── */
          <div className="space-y-6 relative mb-8">
            {/* Vertical line */}
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100" />

            {steps.map((step, index) => (
              <div key={index} className="flex items-start relative z-10 gap-4">
                {/* Step icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-md flex-shrink-0
                  ${step.status === 'completed'
                    ? 'bg-[#C25B8A] text-white'
                    : step.status === 'current'
                      ? 'bg-pink-100 text-[#C25B8A] border-2 border-[#C25B8A]'
                      : 'bg-white text-gray-300 border-2 border-gray-100'
                  }`}>
                  {step.icon}
                </div>

                {/* Step info */}
                <div className="pt-2">
                  <h3 className={`font-bold text-sm ${
                    step.status === 'pending' ? 'text-gray-300' : 'text-gray-800'
                  }`}>
                    {step.label}
                    {step.status === 'current' && (
                      <span className="ml-2 text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold">
                        Current
                      </span>
                    )}
                  </h3>
                  <p className={`text-xs mt-0.5 ${
                    step.status === 'pending' ? 'text-gray-200' : 'text-gray-400'
                  }`}>
                    {step.status === 'completed'
                      ? '✓ ' + step.desc
                      : step.status === 'current'
                        ? step.desc
                        : 'Waiting...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Order Items ────────────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-6 mb-6">
          <h3 className="font-bold text-gray-700 text-sm mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img
                  src={item.productImage || 'https://placehold.co/48x48?text=Item'}
                  alt={item.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-pink-50 flex-shrink-0"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48?text=Item'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400">
                    {item.size && `${item.size} · `}Qty: {item.quantity} · ${item.unitPrice?.toFixed(2)} each
                  </p>
                </div>
                <p className="font-bold text-pink-600 text-sm">${item.subtotal?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Order Summary ─────────────────────────────────────────────────── */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>${order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Delivery</span>
            <span>${order.deliveryCost?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between font-extrabold text-gray-800 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span className="text-pink-600">${order.totalAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 pt-1">
            <span>Payment</span>
            <span className="capitalize">{order.paymentStatus}</span>
          </div>
          {order.deliveryAddress && (
            <div className="flex justify-between text-xs text-gray-400">
              <span>Delivery to</span>
              <span className="text-right max-w-[180px]">{order.deliveryAddress}</span>
            </div>
          )}
        </div>

        {/* ── Bottom Buttons ────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
          >
            ← Back to Orders
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-[#C25B8A] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transition flex items-center justify-center gap-2"
          >
            <FaHome /> Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
