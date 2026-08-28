import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const autofill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-300 relative font-sans">
      
      {/* Top Navbar Simulation for Theme */}
      <header className="bg-slate-200 text-slate-800 rounded-b-xl flex items-center justify-between px-6 py-4 mx-4 md:mx-auto md:w-full md:max-w-7xl shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="bg-slate-900 w-10 h-10 rounded-md flex items-center justify-center">
            {/* Logo Icon simulation */}
            <div className="w-5 h-5 border-4 border-primary rounded-sm relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <span className="cursor-pointer hover:text-slate-500 transition-colors">Product ▾</span>
            <span className="cursor-pointer hover:text-slate-500 transition-colors">Solution ▾</span>
            <span className="cursor-pointer hover:text-slate-500 transition-colors">Resources ▾</span>
          </nav>
        </div>
        <div className="flex items-center space-x-4 text-sm font-semibold">
          <span className="cursor-pointer hover:text-slate-500 transition-colors">SIGN IN</span>
          <button className="bg-primary text-slate-900 px-4 py-2 rounded hover:opacity-90 transition-opacity">
            BOOK A DEMO
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">visibuild</h1>
            <p className="text-lg">Welcome back. Please sign in.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded text-sm mb-6 text-center border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                required 
                type="email" 
                className="w-full rounded bg-slate-800 border-none text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-500" 
                placeholder="Email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input 
                required 
                type="password" 
                className="w-full rounded bg-slate-800 border-none text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-500" 
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full flex items-center justify-center px-4 py-3 bg-primary text-slate-900 rounded font-bold hover:opacity-90 transition-opacity disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          <div className="mt-10 border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-500 mb-4 text-center uppercase tracking-widest font-semibold">Demo Accounts</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['admin@prismo.com', 'ceo@prismo.com', 'pm@prismo.com', 'engineer@prismo.com', 'client@company.com'].map(em => (
                <button 
                  key={em}
                  onClick={() => autofill(em)} 
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded transition-colors text-slate-300"
                >
                  {em.split('@')[0]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Decorative footer element from theme */}
      <div className="absolute bottom-8 right-8 text-slate-800 opacity-50 pointer-events-none">
        <div className="w-48 h-48 border-[12px] border-current rounded-3xl relative rotate-45">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-current rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
