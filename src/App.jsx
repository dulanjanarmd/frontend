import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Logs from './pages/Logs';
import Approvals from './pages/Approvals';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';

const RequireAuth = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }>
        <Route index element={
          currentUser?.role === 'admin' ? <Navigate to="/admin" replace /> : <Dashboard />
        } />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="logs" element={<Logs />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="admin" element={
          <RequireAuth allowedRoles={['admin']}>
            <AdminPortal />
          </RequireAuth>
        } />
      </Route>
    </Routes>
  );
}

export default App;
