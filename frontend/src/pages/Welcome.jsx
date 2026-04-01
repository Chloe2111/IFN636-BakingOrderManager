import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaShoppingBasket } from 'react-icons/fa';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Customer Portal Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center flex flex-col items-center border-4 border-transparent hover:border-pink-200 transition">
          <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center mb-6">
            <FaShoppingBasket size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">I'm a Customer</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Order fresh cakes, cupcakes, and pastries delivered straight to your door.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-pink-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-pink-100 hover:bg-pink-700 transition"
          >
            Start Ordering
          </button>
        </div>

        {/* Admin Portal Card */}
        <div className="bg-slate-800 p-10 rounded-[3rem] shadow-xl text-center flex flex-col items-center border-4 border-transparent hover:border-slate-600 transition">
          <div className="w-20 h-20 bg-slate-700 text-white rounded-3xl flex items-center justify-center mb-6">
            <FaUserShield size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Management</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Access the bakery inventory, manage customer orders, and system reports.
          </p>
          <button 
            onClick={() => navigate('/admin/login')} // Updated Path
            className="w-full bg-white text-slate-800 py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-slate-100 transition"
          >
            Admin Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default Welcome;