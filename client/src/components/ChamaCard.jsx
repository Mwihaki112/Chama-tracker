import { useNavigate } from 'react-router-dom';
import { FaUsers, FaArrowRight } from 'react-icons/fa';

const ChamaCard = ({ chama }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">{chama.name}</h3>
        <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full capitalize">
          {chama.cycle}
        </span>
      </div>

      <p className="text-sm text-gray-500">{chama.description}</p>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FaUsers className="text-green-600" />
        <span>Contribution: Ksh {chama.contribution_amount?.toLocaleString()}</span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-sm text-gray-400">
          Target: Ksh {chama.target_amount?.toLocaleString()}
        </span>
        <button
          onClick={() => navigate(`/chamas/${chama.id}`)}
          className="flex items-center gap-1 text-green-700 font-semibold text-sm hover:underline"
        >
          View <FaArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default ChamaCard;