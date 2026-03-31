import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', category: '', description: '', price: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axiosInstance.get(`/api/products/${id}`);
      setFormData(res.data);
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/products/${id}`, formData);
      alert("Product updated!");
      navigate('/admin/products');
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
        <button onClick={() => navigate(-1)} className="mb-4 text-gray-400 flex items-center"><FaArrowLeft className="mr-2"/> Back</button>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-xl" placeholder="Product Name"
          />
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-3 border rounded-xl"
          >
            <option value="Cupcakes">Cupcakes</option>
            <option value="Cakes">Cakes</option>
          </select>
          <input 
            type="number" value={formData.price} 
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-3 border rounded-xl" placeholder="Price"
          />
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border rounded-xl" rows="4" placeholder="Description"
          />
          <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center">
            <FaSave className="mr-2"/> Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;