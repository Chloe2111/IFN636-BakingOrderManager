import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft } from 'react-icons/fa'; // Ensure react-icons is installed

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '', // Added per your design
    password: '',
    confirmPassword: '' // Added for data accuracy
  });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logic for Password Confirmation check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Sending data to your Node.js/MongoDB backend
      await axiosInstance.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        password: formData.password
      });
      
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {/* Centered Card Layout */}
      <div className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-lg relative border border-gray-100">
        
        {/* Backing Arrow to Welcome Page */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 text-gray-500 hover:text-pink-600 transition"
        >
          <FaArrowLeft size={22} />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Account</h1>
          <p className="text-gray-500 mt-2">Join us and start discovering delicious treats!</p>
        </div>

        {/* Organized Vertical Form Design */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Alice Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="alice@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
            <input
              type="tel"
              placeholder="0412 345 678"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Prominent CTA Button */}
          <button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-md transition-all mt-4 transform active:scale-95"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <span onClick={() => navigate('/login')} className="text-pink-600 cursor-pointer font-bold hover:underline">Log In</span>
        </p>
      </div>
    </div>
  );
};

export default Register;