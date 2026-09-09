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
  Shield,
  AlertTriangle,
  Activity
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
    project_manager: [
      { name: 'Dashboard', path: '/portal', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
      { name: 'Consultations', path: '/portal/consultations', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
      { name: 'Projects', path: '/portal/projects', icon: <Briefcase className="w-4 h-4 mr-2" /> },
      { name: 'Tasks', path: '/portal/tasks', icon: <CheckSquare className="w-4 h-4 mr-2" /> },
      { name: 'Approvals', path: '/portal/approvals', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    ],
    site_engineer: [
      { name: 'Dashboard', path: '/portal', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
      { name: 'My Tasks', path: '/portal/tasks', icon: <CheckSquare className="w-4 h-4 mr-2" /> },
      { name: 'Submit Daily Progress', path: '/portal/logs', icon: <Camera className="w-4 h-4 mr-2" /> },
      { name: 'Report Issue', path: '/portal/issues', icon: <AlertTriangle className="w-4 h-4 mr-2" /> },
      { name: 'My Projects', path: '/portal/projects', icon: <Briefcase className="w-4 h-4 mr-2" /> },
      { name: 'Recent Activity', path: '/portal/activity', icon: <Activity className="w-4 h-4 mr-2" /> },
    ],
    client: [
      { name: 'Dashboard', path: '/portal', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
      { name: 'My Projects', path: '/portal/projects', icon: <Briefcase className="w-4 h-4 mr-2" /> },
      { name: 'Approvals', path: '/portal/approvals', icon: <CheckSquare className="w-4 h-4 mr-2" /> },
    ]
  };

  const roleNav = currentUser ? navItems[currentUser.role] : [];

  return (
    <div className="bg-[#e5e7eb] relative px-4 sm:px-8 z-50 shadow-sm">
      <header className="py-6 mx-auto w-full max-w-7xl flex items-center justify-between">
        
        {/* Left Side: Logo and Nav */}
        <div className="flex items-center space-x-2">
          <Link to="/portal" className="bg-[#1e293b] px-4 py-2 rounded-lg flex items-center h-12 hover:opacity-90 transition-opacity">
            <span className="text-primary font-bold text-xl tracking-tight">Prismo.</span>
          </Link>
          <nav className="hidden md:flex bg-[#d1d5db] h-12 rounded-lg px-2 items-center space-x-1 text-sm font-medium text-[#4b5563]">
            {roleNav.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded ${
                  location.pathname === item.path 
                    ? 'bg-[#9ca3af]/20 text-[#1e293b]' 
                    : 'hover:bg-[#9ca3af]/20 hover:text-[#1e293b]'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Profile and Actions */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center bg-[#d1d5db] h-12 rounded-lg p-1 space-x-1 text-sm font-bold">
            <div className="flex items-center text-[#4b5563] px-4 py-2">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{currentUser?.name}</span>
            </div>
            <button 
              onClick={logout}
              className="px-6 py-2 bg-primary text-[#022c22] rounded-md transition-colors uppercase h-full flex items-center hover:opacity-90"
            >
              <LogOut className="w-4 h-4 mr-2" />
              SIGN OUT
            </button>
          </div>
          <button 
            className="md:hidden text-slate-600 bg-[#d1d5db] h-12 w-12 flex items-center justify-center rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                      : 'text-slate-600'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-slate-300 pt-4 flex items-center justify-between px-4">
                <div className="flex items-center text-slate-600">
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
    </div>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-100  transition-colors duration-300 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto mt-4 md:mt-8">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;
