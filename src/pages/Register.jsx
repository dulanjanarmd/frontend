import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousel';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/portal');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e5e7eb] text-slate-900 relative font-sans overflow-y-auto">
      {/* Exact Header matching Landing Page */}
      <div className="relative px-4 sm:px-8">
        <header className="py-6 mx-auto w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="bg-[#1e293b] px-4 py-2 rounded-lg flex items-center h-12 hover:opacity-90 transition-opacity">
              <span className="text-primary font-bold text-xl tracking-tight">Prismo.</span>
            </Link>
            <nav className="hidden md:flex bg-[#d1d5db] h-12 rounded-lg px-2 items-center space-x-1 text-sm font-medium text-[#4b5563]">
              <div className="px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center">Product <span className="ml-1 text-[10px]">▼</span></div>
              <div className="px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center">Solution <span className="ml-1 text-[10px]">▼</span></div>
              <div className="px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center">Resources <span className="ml-1 text-[10px]">▼</span></div>
            </nav>
          </div>
          
          <div className="flex items-center bg-[#d1d5db] h-12 rounded-lg p-1 space-x-1 text-sm font-bold">
            <Link to="/login" className="px-6 py-2 text-[#4b5563] hover:text-[#1e293b] transition-colors uppercase">
              Sign In
            </Link>
            <Link to="/register" className="px-6 py-2 bg-primary text-[#022c22] rounded-md transition-colors uppercase h-full flex items-center hover:opacity-90">
              Book a Demo
            </Link>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl h-[600px] flex bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden"
        >
          {/* Left Side: Carousel */}
          <div className="hidden md:block w-1/2 h-full relative border-r border-slate-100">
            <ImageCarousel className="absolute inset-0 w-full h-full" />
          </div>
          
          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-between">
            <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-500 text-lg">Join Prismo Constructions Platform</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-6 text-center border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex-1 flex flex-col justify-center space-y-4 my-6">
            <div>
              <input 
                required 
                type="text" 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 text-base focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400" 
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <input 
                required 
                type="email" 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 text-base focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400" 
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input 
                required 
                type="password" 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 text-base focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400" 
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <select 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 text-base focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="CLIENT">Client</option>
                <option value="SITE_ENGINEER">Site Engineer</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
              </select>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full flex items-center justify-center px-4 py-4 bg-[#1e293b] text-white rounded-xl font-bold text-lg hover:bg-primary hover:text-[#022c22] transition-colors disabled:opacity-70 mt-6 shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>

            <div className="text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="absolute -bottom-32 -right-32 text-slate-200 opacity-50 pointer-events-none z-0">
        <div className="w-96 h-96 border-[40px] border-current rounded-full"></div>
      </div>
    </div>
  );
};

export default Register;
