import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus, FaShoppingBasket, FaTag, FaStar } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct]       = useState(null);
  const [quantity, setQuantity]     = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [adding, setAdding]         = useState(false);
  const [error, setError]           = useState('');

  // ── Fetch product from DB ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/products/${id}`);
        const data = res.data;
        setProduct(data);
        // Default to first size option if available
        if (data.priceOptions?.length > 0) {
          setSelectedSize(data.priceOptions[0]);
        }
      } catch (err) {
        setError('Could not load product. Please go back and try again.');
        console.error('Error loading product:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ── Compute current price ─────────────────────────────────────────────────
  const currentPrice = selectedSize?.price ?? product?.basePrice ?? 0;
  const totalPrice   = (currentPrice * quantity).toFixed(2);

  // ── Add to Cart via API ───────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    if (product.priceOptions?.length > 0 && !selectedSize) {
      alert('Please select a size first.');
      return;
    }

    setAdding(true);
    try {
      await axiosInstance.post('/api/cart', {
        product:      product._id,
        productName:  product.name,
        productImage: product.image,
        size:         selectedSize?.size || '',
        quantity,
        unitPrice:    currentPrice,
      });
      alert(`✅ ${product.name} added to your basket!`);
      navigate('/cart');
    } catch (err) {
      alert('Could not add to cart: ' + (err.response?.data?.message || err.message));
    } finally {
      setAdding(false);
    }
  };

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🎂</div>
        <p className="text-gray-400 font-bold">Loading product...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        <p className="text-red-400 font-bold mb-4">{error || 'Product not found'}</p>
        <button onClick={() => navigate(-1)}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold">
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Image ─────────────────────────────────────────────────────── */}
      <div className="relative h-[45vh] w-full bg-pink-50">
        <img
          src={product.image || 'https://placehold.co/800x400?text=No+Image'}
          className="w-full h-full object-cover"
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/800x400?text=No+Image';
          }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg text-slate-800 hover:bg-white transition"
        >
          <FaArrowLeft />
        </button>

        {/* Sale badge */}
        {product.isOnSale && (
          <div className="absolute top-6 right-6 bg-yellow-400 text-gray-800 text-xs font-extrabold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
            <FaTag size={10} /> {product.promotionLabel || 'ON SALE'}
          </div>
        )}
      </div>

      {/* ── Product Info Card ─────────────────────────────────────────────── */}
      <div className="relative -mt-10 bg-white rounded-t-[3rem] p-8 shadow-2xl">
        <div className="max-w-2xl mx-auto">

          {/* Category + Name + Price */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <span className="bg-pink-100 text-pink-600 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest capitalize">
                {product.category}
              </span>
              <h1 className="text-3xl font-black text-slate-800 mt-3 leading-tight">
                {product.name}
              </h1>
              {product.isPopular && (
                <p className="text-yellow-500 text-sm font-bold mt-1 flex items-center gap-1">
                  <FaStar size={12} /> Popular Item
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-pink-600">
                ${currentPrice.toFixed(2)}
              </p>
              {selectedSize && (
                <p className="text-xs text-gray-400 mt-1">{selectedSize.size}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-500 leading-relaxed mb-6 text-base">
            {product.description || 'Freshly baked with love using the finest ingredients. Perfect for any sweet occasion!'}
          </p>

          {/* ── Size Selector ─────────────────────────────────────────────── */}
          {product.priceOptions?.length > 0 && (
            <div className="mb-6">
              <p className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-3">
                Select Size
              </p>
              <div className="flex flex-wrap gap-3">
                {product.priceOptions.map((opt) => (
                  <button
                    key={opt._id}
                    onClick={() => setSelectedSize(opt)}
                    className={`px-5 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                      selectedSize?._id === opt._id
                        ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                        : 'bg-white text-slate-600 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {opt.size}
                    <span className="block text-xs font-extrabold mt-0.5">
                      ${opt.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Quantity Selector ─────────────────────────────────────────── */}
          <div className="flex items-center space-x-6 mb-8">
            <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">
              Quantity
            </span>
            <div className="flex items-center bg-slate-100 rounded-2xl p-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-pink-600 transition"
              >
                <FaMinus />
              </button>
              <span className="px-6 font-black text-xl text-slate-800">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-pink-600 transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* ── Add to Cart Button ────────────────────────────────────────── */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all flex items-center justify-center space-x-4
              ${adding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-slate-800 text-white hover:bg-pink-600 shadow-slate-200'
              }`}
          >
            <FaShoppingBasket />
            <span>
              {adding ? 'Adding...' : `Add to Basket — $${totalPrice}`}
            </span>
          </button>

          {/* Availability */}
          {!product.isAvailable && (
            <p className="text-center text-red-400 font-bold mt-4 text-sm">
              ⚠️ This product is currently unavailable
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
