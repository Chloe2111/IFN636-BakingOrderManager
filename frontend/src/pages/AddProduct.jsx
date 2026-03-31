import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    category: 'Cupcakes',
    name: '',
    description: '',
    price: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create operation (POST)
      await axiosInstance.post('/api/products', formData);
      alert('Product created successfully!');
      navigate('/admin/products'); // Go back to the list
    } catch (error) {
      alert('Failed to create product. Check if the Product ID is unique.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden relative">
        
        {/* Header with Back Button */}
        <div className="bg-pink-600 p-6 text-white flex items-center">
          <button onClick={() => navigate('/admin/products')} className="mr-4">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center flex flex-col items-center hover:border-pink-300 transition cursor-pointer">
            <FaCloudUploadAlt size={40} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Click to upload product image</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Product ID</label>
              <input
                type="text"
                placeholder="e.g. BAKE-001"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-200"
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
              <select 
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-200 bg-white"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Cupcakes">Cupcakes</option>
                <option value="Cakes">Cakes</option>
                <option value="Brownies">Brownies</option>
                <option value="Donuts">Donuts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Red Velvet Dream"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-200"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
            <textarea
              placeholder="Describe the flavors and ingredients..."
              rows="4"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-200"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-200"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transform transition active:scale-95"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;