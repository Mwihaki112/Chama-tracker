import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPiggyBank } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <FaPiggyBank size={24} />
        Chama Tracker
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/" className="text-sm hover:text-green-200 transition">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm hover:text-green-200 transition">
              Dashboard
            </Link>
            <span className="text-sm text-green-200">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-green-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-sm hover:text-green-200 transition">
              Home
            </Link>
            <Link to="/login" className="text-sm hover:text-green-200 transition">
              Login
            </Link>
            <Link
              to="/login"
              className="bg-white text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-green-100 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;