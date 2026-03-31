import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingBasket, FaUserCircle, FaSignOutAlt, FaTools } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* Brand Logo */}
      <Link to="/home" className="text-2xl font-black text-pink-600 italic tracking-tighter">
        Sweet<span className="text-slate-800 underline decoration-pink-300">Bakery</span>
      </Link>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            {/* Logic: If Admin, show Dashboard link. If Customer, show Products link */}
            {user.role === 'admin' ? (
              <Link to="/admin/dashboard" className="text-slate-600 font-bold hover:text-pink-600 flex items-center text-sm">
                <FaTools className="mr-2" /> Admin Panel
              </Link>
            ) : (
              <>
                <Link to="/products" className="text-slate-600 font-bold hover:text-pink-600 text-sm">
                  Menu
                </Link>
                <Link to="/cart" className="relative text-slate-800 hover:text-pink-600 transition">
                  <FaShoppingBasket size={22} />
                  {/* Optional: Add a red dot if items are in cart */}
                </Link>
              </>
            )}

            {/* Common Profile Link for both Admin and Customer */}
            <Link to="/profile" className="flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-2xl group transition hover:bg-pink-100">
              <FaUserCircle className="text-pink-600 group-hover:scale-110 transition" size={20} />
              <span className="text-pink-600 font-black text-sm">{user.name}</span>
            </Link>

            {/* Simple Logout Icon */}
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition"
              title="Logout"
            >
              <FaSignOutAlt size={20} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-500 font-bold hover:text-pink-600 transition text-sm">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-pink-600 transition shadow-lg shadow-gray-200"
            >
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;