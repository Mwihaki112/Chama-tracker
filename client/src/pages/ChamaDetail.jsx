import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getChama, getContributions, getPayouts, joinChama, deleteChama } from '../services/api';
import { FaUsers, FaMoneyBillWave, FaCalendarAlt, FaTrash } from 'react-icons/fa';

const ChamaDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chama, setChama] = useState(null);
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chamaRes = await getChama(id);
        setChama(chamaRes.data.chama);
        setMembers(chamaRes.data.members);
        setIsMember(chamaRes.data.is_member);
        setIsAdmin(chamaRes.data.is_admin);

        const contribRes = await getContributions(id);
        setContributions(Array.isArray(contribRes.data) ? contribRes.data : []);

        const payoutRes = await getPayouts(id);
        setPayouts(Array.isArray(payoutRes.data) ? payoutRes.data : []);
      } catch {
        toast.error('Failed to load chama details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleJoin = async () => {
    try {
      await joinChama(id);
      toast.success('Joined chama successfully!');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to join chama');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this chama?')) return;
    try {
      await deleteChama(id);
      toast.success('Chama deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete chama');
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-400">Loading...</p>;
  if (!chama) return <p className="text-center py-20 text-gray-400">Chama not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{chama.name}</h1>
          <p className="text-gray-500 mt-1">{chama.description}</p>
          <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full capitalize">
            {chama.cycle}
          </span>
        </div>
        <div className="flex gap-3">
          {!isMember && (
            <button
              onClick={handleJoin}
              className="bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition"
            >
              Join Chama
            </button>
          )}
          {isMember && (
            <button
              onClick={() => navigate(`/chamas/${id}/contribute`)}
              className="bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition"
            >
              Log Contribution
            </button>
          )}
          {isAdmin && (
            <button onClick={() => navigate(`/chamas/${id}/edit`)}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-200 transition flex items-center gap-2"
            >
              <FaEdit size={12} /> Edit

            </button>  
          )}
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-200 transition flex items-center gap-2"
            >
              <FaTrash size={12} /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <FaUsers size={28} className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Members</p>
            <p className="text-2xl font-bold text-gray-800">{members.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <FaMoneyBillWave size={28} className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Contribution</p>
            <p className="text-2xl font-bold text-gray-800">Ksh {chama.contribution_amount?.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <FaCalendarAlt size={28} className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Target</p>
            <p className="text-2xl font-bold text-gray-800">Ksh {chama.target_amount?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Members</h2>
        {members.length === 0 ? (
          <p className="text-gray-400 text-sm">No members yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b pb-2 last:border-none">
                <span className="text-sm text-gray-700">User #{m.user_id}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${m.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contributions */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Contributions</h2>
        {contributions.length === 0 ? (
          <p className="text-gray-400 text-sm">No contributions yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="pb-2">Member</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c.id} className="border-b last:border-none">
                  <td className="py-2">User #{c.user_id}</td>
                  <td className="py-2 text-green-700 font-semibold">Ksh {c.amount?.toLocaleString()}</td>
                  <td className="py-2 text-gray-400">{new Date(c.paid_at).toLocaleDateString()}</td>
                  <td className="py-2 text-gray-400">{c.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Payouts */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Payout Schedule</h2>
        {payouts.length === 0 ? (
          <p className="text-gray-400 text-sm">No payout schedule generated yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="pb-2">Recipient</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b last:border-none">
                  <td className="py-2">User #{p.recipient_id}</td>
                  <td className="py-2 text-green-700 font-semibold">Ksh {p.amount?.toLocaleString()}</td>
                  <td className="py-2 text-gray-400">{new Date(p.payout_date).toLocaleDateString()}</td>
                  <td className="py-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ChamaDetail;