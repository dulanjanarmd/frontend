import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

import Dashboard from './pages/Dashboard';

import Projects from './pages/Projects';
import Logs from './pages/Logs';
import Approvals from './pages/Approvals';

// Placeholders for Pages
const Tasks = () => <div className="p-4"><h1 className="text-2xl font-bold">Tasks</h1></div>;

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="glass-card p-8 w-96 text-center">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Prismo Constructions</h1>
          <p className="text-slate-500 mb-6">Please log in to continue</p>
          {/* Mock login happens automatically in AuthContext for now */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="logs" element={<Logs />} />
        <Route path="approvals" element={<Approvals />} />
      </Route>
    </Routes>
  );
}

export default App;
