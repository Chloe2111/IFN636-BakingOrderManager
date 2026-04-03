import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaPlus, FaSearch, FaTrash, FaEdit, FaArrowLeft, FaHome } from 'react-icons/fa';

const AdminProductList = () => {
  const [products, setProducts]   = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await axiosInstance.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* ✅ Back to Dashboard button */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm
                       text-gray-500 hover:text-pink-600 font-bold text-sm transition border border-gray-100"
          >
            <FaArrowLeft size={12} /> Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Product Management</h1>
            <p className="text-slate-400 text-sm">{products.length} products total</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/products/add')}
          className="bg-pink-600 text-white px-5 py-3 rounded-xl flex items-center font-bold hover:bg-pink-700 transition shadow-sm"
        >
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      {/* ── Search Bar ───────────────────────────────────────────────────────── */}
      <div className="relative mb-6 max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 text-sm"
        />
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-bold">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 font-bold">No products found</div>
      ) : (
        /* ── Product Table ────────────────────────────────────────────────── */
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {/* ✅ Added Image column */}
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Image</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Product Name</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                {/* ✅ Fixed: "Price" → shows basePrice correctly */}
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Base Price</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition">

                  {/* ✅ Product image */}
                  <td className="p-4">
                    <img
                      src={product.image || 'https://placehold.co/60x60?text=No+Img'}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60?text=No+Img'; }}
                    />
                  </td>

                  {/* Product name */}
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
                        {product.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full uppercase font-bold capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* ✅ Fixed: uses basePrice not price */}
                  <td className="p-4 font-bold text-gray-800">
                    {product.basePrice != null
                      ? `$${product.basePrice.toFixed(2)}`
                      : product.priceOptions?.length > 0
                        ? `From $${Math.min(...product.priceOptions.map(o => o.price)).toFixed(2)}`
                        : 'N/A'
                    }
                  </td>

                  {/* Status badges */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {product.isOnSale && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold w-fit">
                          ON SALE
                        </span>
                      )}
                      {product.isPopular && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold w-fit">
                          ⭐ Popular
                        </span>
                      )}
                      {!product.isAvailable && (
                        <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-bold w-fit">
                          Unavailable
                        </span>
                      )}
                      {product.isAvailable && !product.isOnSale && !product.isPopular && (
                        <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold w-fit">
                          Active
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                        className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Back to Dashboard (bottom) ────────────────────────────────────── */}
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mt-8 flex items-center gap-2 text-gray-400 hover:text-pink-600 font-bold transition"
      >
        <FaHome size={14} /> Back to Dashboard
      </button>
    </div>
  );
};

export default AdminProductList;
