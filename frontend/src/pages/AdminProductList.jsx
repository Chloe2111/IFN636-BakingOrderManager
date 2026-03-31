import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/api/products');
        setProducts(res.data);
      } catch (err) { console.error("Error fetching products"); }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product permanently?")) {
      try {
        await axiosInstance.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <button onClick={() => navigate('/admin/products/add')} className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center font-bold">
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4"><span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full uppercase font-bold">{product.category}</span></td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">
                  <div className="flex justify-center space-x-4">
                    {/* EDIT BUTTON */}
                    <button 
                      onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-600">
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;