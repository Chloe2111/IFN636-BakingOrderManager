import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth(); // Ensure your AuthContext 'login' function accepts (userData, token)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      
      // NOTE: Adjust 'response.data.user' based on your backend's actual response structure
      const userData = response.data.user || response.data;
      const token = response.data.token;

      // 1. Save to Context/LocalStorage via your AuthProvider
      login(userData, token);
      
      // 2. Role-based Redirection
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 shadow-xl rounded-[2rem] w-full max-w-md relative border border-gray-100">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-8 left-8 text-gray-400 hover:text-pink-600 transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="text-center mt-6">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8">Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition"
              required
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" size="sm" className="text-pink-600 hover:text-pink-700 text-sm font-bold">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-100 transform transition active:scale-95"
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Don't have an account? <Link to="/register" className="text-pink-600 font-black hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;