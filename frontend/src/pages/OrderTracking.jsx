import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaUtensils, FaTruck, FaHome } from 'react-icons/fa';

const OrderTracking = () => {
  const navigate = useNavigate();

  // This would typically come from an API based on the Order ID
  const orderStatus = "Shipped"; 
  const steps = [
    { label: 'Order Placed', icon: <FaCheckCircle />, status: 'Completed' },
    { label: 'Baking', icon: <FaUtensils />, status: 'Completed' },
    { label: 'Shipped', icon: <FaTruck />, status: 'Current' },
    { label: 'Delivered', icon: <FaHome />, status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-600">
        <FaArrowLeft size={20} />
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Order</h1>
        <p className="text-gray-400 text-sm mb-8">Order ID: #SWEET-9921</p>

        {/* Vertical Timeline Stepper */}
        <div className="space-y-8 relative">
          {/* Vertical Line Connector */}
          <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex items-center relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md 
                ${step.status === 'Completed' ? 'bg-pink-600 text-white' : 
                  step.status === 'Current' ? 'bg-pink-100 text-pink-600 border-2 border-pink-600' : 
                  'bg-white text-gray-300 border-2 border-gray-100'}`}>
                {step.icon}
              </div>
              <div className="ml-6">
                <h3 className={`font-bold ${step.status === 'Pending' ? 'text-gray-300' : 'text-gray-800'}`}>
                  {step.label}
                </h3>
                <p className="text-xs text-gray-400">
                  {step.status === 'Completed' ? 'Finished' : step.status === 'Current' ? 'In Progress' : 'Waiting'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-4">Estimated Delivery: **Today, 4:00 PM**</p>
          <button className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;