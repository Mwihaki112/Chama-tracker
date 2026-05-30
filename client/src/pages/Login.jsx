import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password
        });
        login(res.data.access_token, res.data.user);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match!');
          setLoading(false);
          return;
        }
        await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        toast.success('Account created! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Toggle */}
        <div className="flex rounded-full bg-gray-100 p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              isLogin ? 'bg-green-700 text-white' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              !isLogin ? 'bg-green-700 text-white' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;