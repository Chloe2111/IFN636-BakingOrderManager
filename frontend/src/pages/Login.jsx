import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft } from 'react-icons/fa'; // Install react-icons

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      
      // Check if user is admin or customer to direct them correctly
      if (response.data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/home');
    }
  } catch (error) {
    alert('Login failed. Please check your credentials.');
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Centered Card Layout */}
      <div className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-md relative">
        
        {/* Backing Arrow */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 text-gray-600 hover:text-black"
        >
          <FaArrowLeft size={20} />
        </button>

        <h1 className="text-3xl font-bold mt-8 mb-2 text-center text-gray-800">Log In</h1>
        <p className="text-center text-gray-500 mb-8">Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
              required
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" size="sm" className="text-pink-600 hover:underline text-sm font-medium">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-95"
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account? <Link to="/register" className="text-pink-600 font-bold">Create new account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;