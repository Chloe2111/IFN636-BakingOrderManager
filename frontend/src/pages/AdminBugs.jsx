import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { FaBug, FaCheckCircle, FaTrash, FaPlus, FaExclamationTriangle } from 'react-icons/fa';

const AdminBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/bugs');
      setBugs(res.data);
    } catch (err) { console.error("Error fetching bugs"); }
  };

  // UPDATE: Change Bug Status (Open -> Resolved)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';
    try {
      await axiosInstance.put(`/api/admin/bugs/${id}`, { status: newStatus });
      setBugs(bugs.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (err) { alert("Status update failed."); }
  };

  // DELETE: Remove Bug Report
  const deleteBug = async (id) => {
    if (window.confirm("Delete this bug report permanently?")) {
      try {
        await axiosInstance.delete(`/api/admin/bugs/${id}`);
        setBugs(bugs.filter(b => b._id !== id));
      } catch (err) { alert("Delete failed."); }
    }
  };

  const filteredBugs = bugs.filter(b => filter === 'All' || b.status === filter);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <FaBug className="mr-3 text-pink-600" /> System Bug Reports
          </h1>
          <p className="text-slate-500 text-sm">Track and resolve issues reported by customers.</p>
        </div>
        
        {/* ADD: Manual Bug Entry for Admin */}
        <button className="bg-slate-800 text-white px-5 py-3 rounded-xl font-bold flex items-center hover:bg-slate-900 transition shadow-lg">
          <FaPlus className="mr-2" /> Report Internal Bug
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 bg-white p-2 rounded-2xl w-fit shadow-sm border border-slate-200">
        {['All', 'Open', 'Resolved'].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition ${filter === s ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-pink-600'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBugs.map(bug => (
          <div key={bug._id} className={`bg-white p-6 rounded-3xl shadow-sm border-l-8 ${bug.status === 'Resolved' ? 'border-green-400' : 'border-red-400'} relative`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${bug.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {bug.severity} Priority
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{bug.title}</h3>
                <p className="text-xs text-slate-400">Reported by: {bug.customerName || 'Anonymous'}</p>
              </div>
              <button 
                onClick={() => deleteBug(bug._id)}
                className="text-slate-300 hover:text-red-500 transition"
              >
                <FaTrash size={16} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-2xl italic">
              "{bug.description}"
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className={`text-xs font-bold ${bug.status === 'Resolved' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {bug.status === 'Resolved' ? <FaCheckCircle className="mr-1" /> : <FaExclamationTriangle className="mr-1" />}
                {bug.status}
              </span>
              
              {/* UPDATE: Status Toggle */}
              <button 
                onClick={() => toggleStatus(bug._id, bug.status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${bug.status === 'Open' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-500'}`}
              >
                {bug.status === 'Open' ? 'Mark as Resolved' : 'Re-open Issue'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBugs.length === 0 && (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No bug reports found. Everything is sweet! 🧁</p>
        </div>
      )}
    </div>
  );
};

export default AdminBugs;