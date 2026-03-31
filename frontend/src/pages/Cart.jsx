import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  
  // Sample state - in a real app, this comes from a CartContext or Redux
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Chocolate Cupcake',
      description: 'Rich dark chocolate with fudge frosting',
      price: 5.50,
      quantity: 2,
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      name: 'Strawberry Cake',
      description: 'Fresh cream and organic strawberries',
      price: 45.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80'
    }
  ]);

  // CRUD: Update (Quantity)
  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  // CRUD: Delete (Remove from Cart)
  const removeItem = (id) => {
    if(window.confirm("Remove this item from your cart?")) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCost = 5.00;
  const totalPrice = subtotal + deliveryCost;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="p-6 bg-white flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-600">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>
      </div>

      {/* Cart Items List */}
      <div className="p-4 space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center border border-gray-100">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
            
            <div className="flex-1 ml-4">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{item.description}</p>
              <p className="text-pink-600 font-bold">${item.price.toFixed(2)}</p>
              
              <div className="flex items-center mt-2 space-x-3">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                >
                  <FaMinus size={10} />
                </button>
                <span className="font-bold text-sm">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center"
                >
                  <FaPlus size={10} />
                </button>
              </div>
            </div>

            <button 
              onClick={() => removeItem(item.id)}
              className="ml-4 text-gray-300 hover:text-red-500 transition"
            >
              <FaTrash size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary Section (Sticky at bottom) */}
      <div className="fixed bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] p-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Delivery Cost</span>
            <span>${deliveryCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
            <span>Total Price</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;