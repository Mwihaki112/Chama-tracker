import { FaPiggyBank } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <FaPiggyBank size={20} />
          Chama Tracker
        </div>
        <p className="text-sm text-green-200">
          Helping communities save together, one cycle at a time.
        </p>
        <p className="text-sm text-green-200">
          © 2026 Chama Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;