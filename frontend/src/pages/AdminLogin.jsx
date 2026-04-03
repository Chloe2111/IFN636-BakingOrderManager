import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { FaLock, FaUserShield } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });

      // ✅ Fixed: backend returns flat object { _id, name, email, role, token }
      // NOT res.data.user — it's directly res.data.role
      if (res.data.role !== 'admin') {
        setError('Access Denied: You do not have administrator privileges.');
        return;
      }

      // ✅ Fixed: pass the whole res.data object (includes token inside)
      login(res.data);
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-800 rounded-2xl mb-4">
            <FaUserShield size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Admin Control Panel</h1>
          <p className="text-slate-400 text-sm mt-2">Secure access for bakery management</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase ml-1">
              Admin Email
            </label>
            <input
              type="email"
              className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-slate-800 transition"
              placeholder="admin@sweetdelights.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* ✅ Fixed label: "Secret Key" → "Password" */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-slate-800 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black shadow-xl transition flex items-center justify-center space-x-2
              ${loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-800 text-white hover:bg-slate-900'}`}
          >
            <FaLock size={14} />
            <span>{loading ? 'Signing in...' : 'Enter Dashboard'}</span>
          </button>
        </form>

        {/* Hint for demo credentials */}
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-center">
          <p className="text-slate-400 text-xs font-bold mb-1">Demo Admin Credentials</p>
          <p className="text-slate-600 text-xs">julian@sweetdelights.com</p>
          <p className="text-slate-600 text-xs">Admin@1</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-slate-400 text-xs font-bold hover:text-slate-600 transition"
        >
          ← Back to Public Site
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
