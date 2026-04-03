import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import {
  FaBug, FaCheckCircle, FaTrash, FaPlus,
  FaExclamationTriangle, FaArrowLeft, FaHome
} from 'react-icons/fa';

// ✅ Fixed: matches your DB importanceLevel enum values
const priorityColors = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-blue-100 text-blue-600',
};

// ✅ Fixed: matches your DB status enum values
const statusColors = {
  pending:  'border-red-400',
  solving:  'border-yellow-400',
  solved:   'border-green-400',
};

const AdminBugs = () => {
  const [bugs, setBugs]       = useState([]);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newBug, setNewBug]   = useState({ bugName: '', description: '', importanceLevel: 'medium' });
  const navigate = useNavigate();

  useEffect(() => { fetchBugs(); }, []);

  // ✅ Fixed: correct endpoint /api/bugs
  const fetchBugs = async () => {
    try {
      const res = await axiosInstance.get('/api/bugs');
      setBugs(res.data);
    } catch (err) {
      console.error('Error fetching bugs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: correct status values (pending → solving → solved)
  const cycleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending'
      ? 'solving'
      : currentStatus === 'solving'
        ? 'solved'
        : 'pending';
    try {
      await axiosInstance.put(`/api/bugs/${id}`, { status: nextStatus });
      setBugs(bugs.map(b => b._id === id ? { ...b, status: nextStatus } : b));
    } catch (err) {
      alert('Status update failed.');
    }
  };

  // ✅ Fixed: correct endpoint /api/bugs/:id
  const deleteBug = async (id) => {
    if (window.confirm('Delete this bug report permanently?')) {
      try {
        await axiosInstance.delete(`/api/bugs/${id}`);
        setBugs(bugs.filter(b => b._id !== id));
      } catch (err) {
        alert('Delete failed.');
      }
    }
  };

  // Add bug internally (admin reporting)
  const handleAddBug = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/bugs', {
        ...newBug,
        reportedBy: null,
      });
      setBugs([res.data, ...bugs]);
      setNewBug({ bugName: '', description: '', importanceLevel: 'medium' });
      setShowAdd(false);
    } catch (err) {
      alert('Failed to add bug: ' + (err.response?.data?.message || err.message));
    }
  };

  // ✅ Fixed: filter by correct status values
  const filterOptions = ['all', 'pending', 'solving', 'solved'];
  const filteredBugs = bugs.filter(b => filter === 'all' || b.status === filter);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-3 bg-white rounded-xl shadow-sm hover:text-pink-600 transition border border-gray-100"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <FaBug className="text-pink-600" /> Bug Reports
            </h1>
            <p className="text-slate-400 text-sm">
              {bugs.filter(b => b.status !== 'solved').length} unresolved · {bugs.length} total
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-slate-800 text-white px-5 py-3 rounded-xl font-bold flex items-center hover:bg-slate-900 transition shadow-lg"
        >
          <FaPlus className="mr-2" /> Report Internal Bug
        </button>
      </div>

      {/* ── Add Bug Form ──────────────────────────────────────────────────── */}
      {showAdd && (
        <form onSubmit={handleAddBug}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
          <h2 className="font-bold text-gray-800">Report New Bug</h2>
          <input
            type="text"
            placeholder="Bug name / title"
            value={newBug.bugName}
            onChange={e => setNewBug({ ...newBug, bugName: e.target.value })}
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            required
          />
          <textarea
            placeholder="Describe the bug in detail..."
            value={newBug.description}
            onChange={e => setNewBug({ ...newBug, description: e.target.value })}
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            rows={3}
            required
          />
          <select
            value={newBug.importanceLevel}
            onChange={e => setNewBug({ ...newBug, importanceLevel: e.target.value })}
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="flex gap-3">
            <button type="submit"
                    className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition">
              Submit Bug
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Filter Tabs ───────────────────────────────────────────────────── */}
      <div className="flex space-x-2 mb-6 bg-white p-2 rounded-2xl w-fit shadow-sm border border-slate-200">
        {filterOptions.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition capitalize
              ${filter === s ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-pink-600'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Bug Cards ────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-bold">Loading bugs...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBugs.map(bug => (
            <div
              key={bug._id}
              className={`bg-white p-6 rounded-3xl shadow-sm border-l-8 relative
                ${statusColors[bug.status] || 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  {/* ✅ Fixed: importanceLevel not severity */}
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md capitalize
                    ${priorityColors[bug.importanceLevel] || 'bg-gray-100 text-gray-600'}`}>
                    {bug.importanceLevel} Priority
                  </span>
                  {/* ✅ Fixed: bugName not title */}
                  <h3 className="text-lg font-bold text-slate-800 mt-2">{bug.bugName}</h3>
                  <p className="text-xs text-slate-400">
                    Reported by: {bug.reportedBy?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {new Date(bug.createdAt).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
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
                {/* ✅ Fixed: correct status values */}
                <span className={`text-xs font-bold flex items-center gap-1 capitalize
                  ${bug.status === 'solved' ? 'text-green-500'
                    : bug.status === 'solving' ? 'text-yellow-500'
                    : 'text-red-500'}`}>
                  {bug.status === 'solved'
                    ? <FaCheckCircle />
                    : <FaExclamationTriangle />}
                  {bug.status}
                </span>

                {/* Cycle through statuses */}
                <button
                  onClick={() => cycleStatus(bug._id, bug.status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition
                    ${bug.status === 'solved'
                      ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      : bug.status === 'solving'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600'
                        : 'bg-yellow-500 text-white shadow-lg shadow-yellow-200 hover:bg-yellow-600'}`}
                >
                  {bug.status === 'pending'  ? 'Mark as Solving'
                    : bug.status === 'solving' ? 'Mark as Solved'
                    : 'Re-open Issue'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredBugs.length === 0 && (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No bug reports found. Everything is sweet! 🧁</p>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mt-8 flex items-center gap-2 text-gray-400 hover:text-pink-600 font-bold transition"
      >
        <FaHome size={14} /> Back to Dashboard
      </button>
    </div>
  );
};

export default AdminBugs;
