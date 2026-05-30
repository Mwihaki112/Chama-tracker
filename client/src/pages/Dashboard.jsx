import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getChamas } from '../services/api';
import { getMyChamas } from '../services/api';
import ChamaCard from '../components/ChamaCard';
import { FaPlus } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chamas, setChamas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyChamas()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setChamas(data);
      })
      .catch(() => toast.error('Failed to load chamas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name} 
          </h1>
          <p className="text-gray-500 mt-1">
            Here are all your savings groups
          </p>
        </div>
        <button
          onClick={() => navigate('/chamas/create')}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-green-800 transition"
        >
          <FaPlus size={14} />
          New Chama
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Chamas</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{chamas.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Active Groups</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{chamas.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-3xl font-bold text-green-700 mt-1">
            {user?.created_at ? new Date(user.created_at).getFullYear(): '-'}
          </p>
        </div>
      </div>

      {/* Chamas Grid */}
      {loading ? (
        <p className="text-gray-400 text-center py-20">Loading chamas...</p>
      ) : chamas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">You have no chamas yet</p>
          <button
            onClick={() => navigate('/chamas/create')}
            className="bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-green-800 transition"
          >
            Create your first chama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chamas.map((chama) => (
            <ChamaCard key={chama.id} chama={chama} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;