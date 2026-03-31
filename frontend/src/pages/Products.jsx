import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products');
        setProducts(response.data);
      } catch (err) { console.error("Error fetching products"); }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-4">Our Bakery Menu</h1>
        <input 
          type="text" 
          placeholder="Search for cakes, cupcakes..." 
          className="w-full p-4 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-pink-300 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product._id} 
            onClick={() => navigate(`/product/${product._id}`)} // Navigate to Details
            className="bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-pink-100"
          >
            <img src={product.image} className="w-full h-48 object-cover rounded-[1.5rem] mb-4" alt={product.name} />
            <div className="px-2">
              <span className="text-[10px] bg-pink-50 text-pink-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                {product.category}
              </span>
              <h3 className="font-bold text-slate-800 mt-2 text-lg">{product.name}</h3>
              <p className="text-pink-600 font-black text-xl mt-1">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;