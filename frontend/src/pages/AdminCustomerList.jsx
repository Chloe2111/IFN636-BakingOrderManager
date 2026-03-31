import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaUserPlus, FaSearch, FaTrash, FaInfoCircle, FaEdit } from 'react-icons/fa';

const AdminCustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const navigate = useNavigate();

  // READ logic remains the same
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/customers');
        setCustomers(res.data);
      } catch (err) { console.error("Fetch failed"); }
    };
    fetchCustomers();
  }, []);

  const triggerDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Header & Search stay the same... */}
        
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-5 font-bold text-gray-600 text-sm uppercase">Customer ID</th>
                <th className="p-5 font-bold text-gray-600 text-sm uppercase">Full Name</th>
                <th className="p-5 font-bold text-gray-600 text-sm uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-pink-50/30 transition">
                  <td className="p-5 text-sm font-mono text-gray-400">{customer.customerId || 'USR-000'}</td>
                  <td className="p-5 font-semibold text-gray-800">{customer.name}</td>
                  <td className="p-5">
                    <div className="flex justify-center items-center space-x-3">
                      {/* VIEW DETAIL BUTTON */}
                      <button 
                        onClick={() => navigate(`/admin/customers/details/${customer._id}`)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <FaInfoCircle size={18} />
                      </button>

                      {/* SEPARATE EDIT BUTTON */}
                      <button 
                        onClick={() => navigate(`/admin/customers/edit/${customer._id}`)}
                        className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        title="Edit Customer"
                      >
                        <FaEdit size={18} />
                      </button>

                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => triggerDelete(customer)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Account"
                      >
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

      {/* Delete Modal Logic remains the same... */}
    </>
  );
};

export default AdminCustomerList;