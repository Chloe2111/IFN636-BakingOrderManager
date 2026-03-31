import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Sweet Delights Bakery</h1>
        <p className="text-gray-600 mb-10">Freshly baked happiness delivered to your doorstep.</p>
        
        <div className="space-y-4 w-full">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-pink-700 transition"
          >
            Log In
          </button>
          
          <button 
            onClick={() => navigate('/register')}
            className="w-full bg-white text-pink-600 border-2 border-pink-600 py-4 rounded-xl font-bold hover:bg-pink-50 transition"
          >
            Create new account
          </button>
        </div>
        
        <button 
          onClick={() => navigate('/admin/login')}
          className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Log In as administrator
        </button>
      </div>
    </div>
  );
};

export default Welcome;