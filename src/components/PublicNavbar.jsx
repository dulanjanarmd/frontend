import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicNavbar = () => {
  const location = useLocation();

  return (
    <header className="py-6 mx-auto w-full max-w-7xl flex flex-col md:flex-row md:items-center justify-between z-50 relative">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center space-x-2">
          <Link to="/" className="bg-[#1e293b] px-4 py-2 rounded-lg flex items-center h-12 hover:opacity-90 transition-opacity">
            <span className="text-primary font-bold text-xl tracking-tight">Prismo.</span>
          </Link>
          <nav className="hidden md:flex bg-[#d1d5db] h-12 rounded-lg px-2 items-center space-x-1 text-sm font-medium text-[#4b5563]">
            <Link to="/product" className={`px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center ${location.pathname === '/product' ? 'bg-[#9ca3af]/20 text-[#1e293b]' : ''}`}>Product <span className="ml-1 text-[10px]">▼</span></Link>
            <Link to="/solution" className={`px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center ${location.pathname === '/solution' ? 'bg-[#9ca3af]/20 text-[#1e293b]' : ''}`}>Solution <span className="ml-1 text-[10px]">▼</span></Link>
            <Link to="/resources" className={`px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center ${location.pathname === '/resources' ? 'bg-[#9ca3af]/20 text-[#1e293b]' : ''}`}>Resources <span className="ml-1 text-[10px]">▼</span></Link>
          </nav>
        </div>
      </div>
      
      <div className="hidden md:flex items-center bg-[#d1d5db] h-12 rounded-lg p-1 space-x-1 text-sm font-bold">
        {location.pathname === '/login' ? (
          <Link to="/register" className="px-6 py-2 text-[#4b5563] hover:text-[#1e293b] transition-colors uppercase">
            Sign Up
          </Link>
        ) : (
          <Link to="/login" className="px-6 py-2 text-[#4b5563] hover:text-[#1e293b] transition-colors uppercase">
            Sign In
          </Link>
        )}
        
        {location.pathname === '/' ? (
          <a href="#contact" className="px-6 py-2 bg-primary text-[#022c22] rounded-md transition-colors uppercase h-full flex items-center hover:opacity-90">
            Book a Demo
          </a>
        ) : (
          <Link to="/register" className="px-6 py-2 bg-primary text-[#022c22] rounded-md transition-colors uppercase h-full flex items-center hover:opacity-90">
            Book a Demo
          </Link>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;
