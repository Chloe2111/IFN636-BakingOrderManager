import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus, FaShoppingBasket } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) { console.error("Error loading product"); }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Logic to update your Cart Context or LocalStorage
    console.log(`Added ${quantity} of ${product.name} to cart`);
    alert(`${product.name} added to cart!`);
    navigate('/cart');
  };

  if (!product) return <div className="p-10 text-center">Baking data...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image Section */}
      <div className="relative h-[45vh] w-full">
        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg text-slate-800"
        >
          <FaArrowLeft />
        </button>
      </div>

      {/* Product Info Section */}
      <div className="relative -mt-10 bg-white rounded-t-[3rem] p-8 shadow-2xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="bg-pink-100 text-pink-600 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-4xl font-black text-slate-800 mt-4">{product.name}</h1>
            </div>
            <p className="text-3xl font-black text-pink-600">${product.price}</p>
          </div>

          <p className="text-slate-500 leading-relaxed mb-8 text-lg">
            {product.description || "Freshly baked with love using the finest ingredients. Perfect for any sweet occasion!"}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-6 mb-10">
            <span className="font-bold text-slate-400 uppercase text-sm tracking-widest">Quantity</span>
            <div className="flex items-center bg-slate-100 rounded-2xl p-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-pink-600"
              >
                <FaMinus />
              </button>
              <span className="px-8 font-black text-xl text-slate-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-pink-600"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-slate-800 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-slate-200 hover:bg-pink-600 transition-all flex items-center justify-center space-x-4"
          >
            <FaShoppingBasket />
            <span>Add to Basket — ${(product.price * quantity).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;