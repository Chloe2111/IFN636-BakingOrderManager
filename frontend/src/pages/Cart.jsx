import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // ── Fetch cart from API ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get('/api/cart');
        setCart(res.data);
      } catch (err) {
        setError('Could not load cart.');
        console.error('Cart fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // ── Update item quantity ──────────────────────────────────────────────────
  const updateQuantity = async (itemId, delta) => {
    const item = cart.items.find(i => i._id === itemId);
    const newQty = Math.max(1, item.quantity + delta);
    try {
      const res = await axiosInstance.put(`/api/cart/${itemId}`, { quantity: newQty });
      setCart(res.data);
    } catch (err) {
      console.error('Update error:', err.message);
    }
  };

  // ── Remove item from cart ─────────────────────────────────────────────────
  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item from your cart?')) return;
    try {
      const res = await axiosInstance.delete(`/api/cart/${itemId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Remove error:', err.message);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🛒</div>
        <p className="text-gray-400 font-bold">Loading your cart...</p>
      </div>
    </div>
  );

  // ── Empty cart ────────────────────────────────────────────────────────────
  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-48">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="p-6 bg-white flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-pink-600 transition">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>
        {!isEmpty && (
          <span className="ml-2 bg-pink-100 text-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* ── Empty State ───────────────────────────────────────────────────── */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <FaShoppingBag className="text-pink-200 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet!</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-700 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* ── Cart Items ───────────────────────────────────────────────── */}
          <div className="p-4 space-y-4">
            {cart.items.map(item => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-2xl shadow-sm flex items-center border border-gray-100 gap-4"
              >
                {/* ✅ Product Image from productImage field */}
                <img
                  src={item.productImage || 'https://placehold.co/80x80?text=Item'}
                  alt={item.productName}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-pink-50"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/80x80?text=Item';
                  }}
                />

                <div className="flex-1 min-w-0">
                  {/* Product name */}
                  <h3 className="font-bold text-gray-800 truncate">{item.productName}</h3>

                  {/* Size */}
                  {item.size && (
                    <p className="text-xs text-gray-400 mb-1">Size: {item.size}</p>
                  )}

                  {/* Unit price */}
                  <p className="text-pink-600 font-bold">${item.unitPrice?.toFixed(2)}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center mt-2 space-x-3">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>

                {/* Subtotal + Delete */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <p className="font-extrabold text-gray-800 text-sm">
                    ${item.subtotal?.toFixed(2) || (item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-gray-300 hover:text-red-500 transition p-1"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary (sticky bottom) ────────────────────────────── */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl
                          shadow-[0_-10px_20px_rgba(0,0,0,0.08)] p-6 z-10">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>${cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Delivery Cost</span>
                <span>${cart.deliveryCost?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-pink-600">${cart.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transition"
            >
              Proceed to Checkout — ${cart.totalAmount?.toFixed(2)}
            </button>
          </div>
        </>
      )}

      {/* Error message */}
      {error && (
        <p className="text-center text-red-400 text-sm p-4">{error}</p>
      )}
    </div>
  );
};

export default Cart;
