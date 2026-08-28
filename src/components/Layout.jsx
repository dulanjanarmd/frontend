import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  CheckSquare, 
  Camera, 
  MessageSquare, 
  Menu, 
  X,
  LogOut,
  User,
  LayoutDashboard,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = {
    admin: [
      { name: 'Admin Portal', path: '/portal/admin', icon: <Shield className="w-4 h-4 mr-2" /> },
    ],
    ceo: [
      { name: 'Portfolio', path: '/portal', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
      { name: 'Consultations', path: '/portal/consultations', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    ],
    pm: [
      { name: 'Dashboard', path: '/portal', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
      { name: 'Consultations', path: '/portal/consultations', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
      { name: 'Projects', path: '/portal/projects', icon: <Briefcase className="w-4 h-4 mr-2" /> },
      { name: 'Tasks', path: '/portal/tasks', icon: <CheckSquare className="w-4 h-4 mr-2" /> },
      { name: 'Approvals', path: '/portal/approvals', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    ],
    site_engineer: [
      { name: 'My Tasks', path: '/portal/tasks', icon: <CheckSquare className="w-4 h-4 mr-2" /> },
      { name: 'Daily Logs', path: '/portal/logs', icon: <Camera className="w-4 h-4 mr-2" /> },
    ],
    client: [
      { name: 'My Project', path: '/portal', icon: <Briefcase className="w-4 h-4 mr-2" /> },
      { name: 'Approvals', path: '/portal/approvals', icon: <CheckSquare className="w-4 h-4 mr-2" /> },
    ]
  };

  const roleNav = currentUser ? navItems[currentUser.role] : [];

  return (
    <header className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-b-xl flex flex-col md:flex-row md:items-center justify-between px-6 py-4 mx-4 md:mx-auto md:w-full md:max-w-7xl shadow-sm relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="bg-slate-900 w-10 h-10 rounded-md flex items-center justify-center">
            {/* Logo Icon simulation */}
            <div className="w-5 h-5 border-4 border-primary rounded-sm relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
        <button 
          className="md:hidden text-slate-600 dark:text-slate-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-2 items-center flex-1 justify-center">
        {roleNav.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded ${
              location.pathname === item.path 
                ? 'text-primary' 
                : 'hover:text-slate-500 dark:hover:text-slate-400'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center space-x-4 text-sm font-semibold">
        <div className="flex items-center text-slate-600 dark:text-slate-400 mr-2">
          <User className="w-4 h-4 mr-2" />
          <span className="font-medium text-xs">{currentUser?.name}</span>
        </div>
        <button 
          onClick={logout}
          className="bg-primary text-slate-900 px-4 py-2 rounded hover:opacity-90 transition-opacity flex items-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          SIGN OUT
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden flex flex-col space-y-4 pt-6 pb-2 overflow-hidden"
          >
            {roleNav.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded ${
                  location.pathname === item.path 
                    ? 'text-primary' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="border-t border-slate-300 dark:border-slate-700 pt-4 flex items-center justify-between px-4">
               <div className="flex items-center text-slate-600 dark:text-slate-400">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium text-xs">{currentUser?.name}</span>
              </div>
              <button 
                onClick={logout}
                className="text-red-500 flex items-center text-sm font-semibold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                SIGN OUT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto mt-4 md:mt-8">
        <Outlet />
      </main>

      {/* Decorative footer from theme */}
      <footer className="bg-slate-900 text-slate-400 mt-auto py-12 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-2">Prismo Constructions</h2>
            <p className="text-sm">Digital Transformation Platform for Construction Consultancy</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>Project Management</li>
              <li>Site Progress</li>
              <li>Client Approvals</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Help Centre</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute bottom-4 right-4 text-slate-800 opacity-50 pointer-events-none">
          <div className="w-32 h-32 border-[8px] border-current rounded-2xl relative rotate-45 translate-x-10 translate-y-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-current rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
