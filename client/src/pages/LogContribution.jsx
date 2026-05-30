import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getChama, addContribution } from '../services/api';

const LogContribution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chama, setChama] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    notes: ''
  });

  useEffect(() => {
    getChama(id)
      .then((res) => setChama(res.data.chama))
      .catch(() => toast.error('Failed to load chama'));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addContribution(id, {
        amount: parseFloat(formData.amount),
        notes: formData.notes
      });
      toast.success('Contribution logged successfully!');
      navigate(`/chamas/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to log contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Log Contribution
        </h2>
        {chama && (
          <p className="text-gray-500 text-sm mb-6">
            Contributing to <span className="text-green-700 font-semibold">{chama.name}</span> — Ksh {chama.contribution_amount?.toLocaleString()} per {chama.cycle === 'monthly' ? 'month' : 'week'}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Amount (Ksh)
            </label>
            <input
              type="number"
              name="amount"
              placeholder={`e.g. ${chama?.contribution_amount || 2000}`}
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              placeholder="e.g. January contribution"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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
              {loading ? 'Saving...' : 'Log Contribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogContribution;