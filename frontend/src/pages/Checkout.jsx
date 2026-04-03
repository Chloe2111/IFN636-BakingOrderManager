import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaTruck, FaLock, FaSpinner } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [cart, setCart]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [placing, setPlacing]           = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('unpaid');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [notes, setNotes]               = useState('');

  // ── Fetch cart ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get('/api/cart');
        setCart(res.data);
      } catch (err) {
        console.error('Cart fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // ── Place order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!cart || cart.items?.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      alert('Please enter a delivery address.');
      return;
    }

    setPlacing(true);
    try {
      // ✅ Build order from real cart data
      const orderData = {
        customer:        user._id,
        items:           cart.items.map(item => ({
          product:      item.product?._id || item.product,
          productName:  item.productName,
          productImage: item.productImage,
          size:         item.size,
          quantity:     item.quantity,
          unitPrice:    item.unitPrice,
        })),
        deliveryCost:    cart.deliveryCost || 0,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : '',
        paymentStatus:   paymentMethod,
        notes,
        createdBy:       user._id,
      };

      // ✅ Create order via API
      const res = await axiosInstance.post('/api/orders', orderData);
      const newOrder = res.data;

      // ✅ Clear the cart after successful order
      await axiosInstance.delete('/api/cart/clear').catch(() => {});

      alert('🎉 Order placed successfully!');

      // ✅ Navigate to real order tracking with real _id
      navigate(`/order-tracking/${newOrder._id}`);

    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message);
      alert('Checkout failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🧁</div>
        <p className="text-gray-400 font-bold">Loading checkout...</p>
      </div>
    </div>
  );

  const isEmpty = !cart || cart.items?.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-40">
      <div className="max-w-xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <button onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-600 font-bold hover:text-pink-600 transition">
          <FaArrowLeft className="mr-2" /> Back to Cart
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        {/* ── Order Summary ─────────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
          {isEmpty ? (
            <p className="text-gray-400 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.productImage || 'https://placehold.co/48x48?text=Item'}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover border border-pink-50"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48?text=Item'; }}
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">{item.productName}</p>
                    <p className="text-xs text-gray-400">
                      {item.size && `${item.size} · `}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-pink-600 text-sm">${item.subtotal?.toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>${cart.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span><span>${cart.deliveryCost?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-800 pt-1">
                  <span>Total</span>
                  <span className="text-pink-600">${cart.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Delivery Method ───────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-4 border border-gray-100">
          <div className="flex items-center mb-4 text-pink-600">
            <FaTruck className="mr-2" />
            <h2 className="font-bold text-gray-800">Delivery Method</h2>
          </div>
          <div className="flex gap-3 mb-4">
            {['delivery', 'pickup'].map(method => (
              <button
                key={method}
                onClick={() => setDeliveryMethod(method)}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm capitalize border-2 transition
                  ${deliveryMethod === method
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-pink-300'}`}
              >
                {method}
              </button>
            ))}
          </div>

          {/* Delivery address — only show if delivery selected */}
          {deliveryMethod === 'delivery' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* ── Payment Method ────────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-4 border border-gray-100">
          <div className="flex items-center mb-4 text-pink-600">
            <FaCreditCard className="mr-2" />
            <h2 className="font-bold text-gray-800">Payment Status</h2>
          </div>
          <div className="space-y-2">
            {[
              { value: 'unpaid',        label: 'Pay on Pickup / Delivery' },
              { value: 'deposit-paid',  label: 'Deposit Paid'             },
              { value: 'paid',          label: 'Fully Paid'               },
            ].map(opt => (
              <label key={opt.value}
                     className="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-pink-50 transition">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value)}
                  className="accent-pink-600 w-4 h-4"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Notes ────────────────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3">Special Requests (optional)</h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. No nuts, extra icing, write Happy Birthday..."
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            rows={3}
          />
        </div>

      </div>

      {/* ── Sticky Bottom — Place Order ───────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.07)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold">Total to Pay</p>
            <p className="text-2xl font-bold text-pink-600">
              ${cart?.totalAmount?.toFixed(2) || '0.00'}
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placing || isEmpty}
            className={`flex-1 py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition
              ${placing || isEmpty
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'}`}
          >
            {placing ? (
              <><FaSpinner className="animate-spin" /> Placing Order...</>
            ) : (
              <><FaLock /> Place Order</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
