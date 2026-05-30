import { Link } from 'react-router-dom';
import { FaPiggyBank, FaUsers, FaChartLine } from 'react-icons/fa';

const features = [
  {
    icon: <FaPiggyBank size={32} className="text-green-600" />,
    title: "Track Contributions",
    description: "Log and monitor every member's contribution in real time, no more paper records or WhatsApp chaos."
  },
  {
    icon: <FaUsers size={32} className="text-green-600" />,
    title: "Manage Members",
    description: "Add members to your chama, assign roles, and keep everyone accountable in one place."
  },
  {
    icon: <FaChartLine size={32} className="text-green-600" />,
    title: "View Payouts",
    description: "Automatically generate a payout schedule based on join order so everyone knows when their turn is."
  },
];

const Home = () => {
  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Manage Your Chama <br /> the Smart Way
        </h1>
        <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
          A simple, transparent platform for savings groups to track contributions, manage members, and plan payouts.
        </p>
        <Link
          to="/login"
          className="bg-white text-green-700 font-bold px-8 py-3 rounded-full text-lg hover:bg-green-100 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything your chama needs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-500 mb-8">
          Join hundreds of savings groups already using Chama Tracker.
        </p>
        <Link
          to="/login"
          className="bg-green-700 text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-green-800 transition"
        >
          Create an Account
        </Link>
      </section>

    </div>
  );
};

export default Home;