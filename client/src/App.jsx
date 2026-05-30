import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChamaDetail from './pages/ChamaDetail';
import CreateChama from './pages/CreateChama';
import LogContribution from './pages/LogContribution';
import EditChama from './pages/EditChama';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/chamas/:id" element={
                <ProtectedRoute>
                  <ChamaDetail />
                </ProtectedRoute>
              } />
              <Route path="/chamas/create" element={
                <ProtectedRoute>
                  <CreateChama />
                </ProtectedRoute>
              } />
              <Route path="/chamas/:id/edit" element={
                <ProtectedRoute>
                  <EditChama />
                </ProtectedRoute>  
              } />
              <Route path="/chamas/:id/contribute" element={
                <ProtectedRoute>
                  <LogContribution />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;