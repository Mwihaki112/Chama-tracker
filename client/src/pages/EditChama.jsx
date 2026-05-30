import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getChama, updateChama } from '../services/api';

const EditChama = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    contribution_amount: '',
    cycle: 'monthly'
  });

  useEffect(() => {
    getChama(id)
      .then((res) => {
        const c = res.data.chama;
        setFormData({
          name: c.name,
          description: c.description || '',
          target_amount: c.target_amount,
          contribution_amount: c.contribution_amount,
          cycle: c.cycle
        });
      })
      .catch(() => toast.error('Failed to load chama'));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateChama(id, {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        contribution_amount: parseFloat(formData.contribution_amount)
      });
      toast.success('Chama updated successfully!');
      navigate(`/chamas/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update chama');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Chama</h2>
        <p className="text-gray-500 text-sm mb-6">Update your savings group details</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Chama Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contribution Amount (Ksh)</label>
            <input
              type="number"
              name="contribution_amount"
              value={formData.contribution_amount}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Target Amount (Ksh)</label>
            <input
              type="number"
              name="target_amount"
              value={formData.target_amount}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Cycle</label>
            <select
              name="cycle"
              value={formData.cycle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate(`/chamas/${id}`)}
              className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChama;