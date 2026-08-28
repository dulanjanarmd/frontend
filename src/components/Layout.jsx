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
  Sun, 
  Moon,
  LogOut,
  User,
  LayoutDashboard,
  Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, isDarkMode, toggleTheme }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navItems = {
    admin: [
      { name: 'Admin Portal', path: '/admin', icon: <Shield className="w-5 h-5" /> },
    ],
    ceo: [
      { name: 'Portfolio Overview', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    ],
    pm: [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'Projects', path: '/projects', icon: <Briefcase className="w-5 h-5" /> },
      { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
      { name: 'Client Approvals', path: '/approvals', icon: <MessageSquare className="w-5 h-5" /> },
    ],
    site_engineer: [
      { name: 'My Tasks', path: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
      { name: 'Daily Logs', path: '/logs', icon: <Camera className="w-5 h-5" /> },
    ],
    client: [
      { name: 'My Project', path: '/', icon: <Briefcase className="w-5 h-5" /> },
      { name: 'Approvals', path: '/approvals', icon: <CheckSquare className="w-5 h-5" /> },
    ]
  };

  const roleNav = currentUser ? navItems[currentUser.role] : [];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out glass dark:bg-slate-950/80 border-r`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Prismo</span>
        <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-16rem)]">
        {roleNav.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => {if(window.innerWidth < 1024) toggleSidebar()}}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span className="ml-3 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{currentUser?.name}</span>
              <span className="text-xs text-slate-500 capitalize">{currentUser?.role.replace('_', ' ')}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={logout}
              className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 flex items-center px-6 lg:hidden glass sticky top-0 z-40">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Prismo
          </span>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10 translate-y-1/3 -translate-x-1/3"></div>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
