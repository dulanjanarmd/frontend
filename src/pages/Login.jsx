import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      navigate('/portal');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative font-sans overflow-hidden">
      
      {/* Top Navbar Simulation for Theme */}
      <header className="bg-white text-slate-800 rounded-b-xl flex items-center justify-between px-6 py-4 mx-4 md:mx-auto md:w-full md:max-w-7xl shadow-sm border border-slate-200">
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
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity">
            BOOK A DEMO
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Prismo Constructions</h1>
            <p className="text-slate-500">Welcome back. Please sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-6 text-center border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                required 
                type="email" 
                className="w-full rounded bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400" 
                placeholder="Email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input 
                required 
                type="password" 
                className="w-full rounded bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400" 
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Link to="/reset-password" className="text-sm text-primary font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition-opacity disabled:opacity-70 mt-2 shadow-sm shadow-primary/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
          </div>
        </motion.div>
      </main>

      {/* Decorative background element */}
      <div className="absolute -bottom-32 -right-32 text-slate-200 opacity-50 pointer-events-none z-0">
        <div className="w-96 h-96 border-[40px] border-current rounded-full"></div>
      </div>
    </div>
  );
};

export default Login;
