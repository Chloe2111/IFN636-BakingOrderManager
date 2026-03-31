import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaTruck, FaLock } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePlaceOrder = async () => {
    try {
      // Create Operation: Send checkout data to backend
      // await axiosInstance.post('/api/orders', { ... });
      alert("Order Placed Successfully!");
      navigate('/order-tracking/123'); 
    } catch (err) {
      alert("Checkout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 font-bold">
          <FaArrowLeft className="mr-2" /> Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        {/* Shipping Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-4 border border-gray-100">
          <div className="flex items-center mb-4 text-pink-600">
            <FaTruck className="mr-2" />
            <h2 className="font-bold">Shipping Address</h2>
          </div>
          <p className="text-gray-600 text-sm">Alice Johnson</p>
          <p className="text-gray-600 text-sm">123 Sugar Lane, Brisbane, QLD 4000</p>
          <button className="mt-3 text-pink-600 text-xs font-bold border border-pink-100 px-3 py-1 rounded-full">Edit Address</button>
        </div>

        {/* Payment Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center mb-4 text-pink-600">
            <FaCreditCard className="mr-2" />
            <h2 className="font-bold">Payment Method</h2>
          </div>
          <div className="space-y-3">
            {['Credit Card', 'PayPal', 'Bank Transfer'].map(method => (
              <label key={method} className="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-pink-50 transition">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === method.toLowerCase()} 
                  onChange={() => setPaymentMethod(method.toLowerCase())}
                  className="accent-pink-600 w-4 h-4"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Final Action */}
        <div className="fixed bottom-0 left-0 w-full bg-white p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">Total to Pay</p>
              <p className="text-2xl font-bold text-gray-800">$50.00</p>
            </div>
            <button 
              onClick={handlePlaceOrder}
              className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg flex items-center"
            >
              <FaLock className="mr-2" /> Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;