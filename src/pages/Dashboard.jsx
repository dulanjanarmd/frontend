import React from 'react';
import { useAuth } from '../context/AuthContext';
import PMDashboard from '../components/PMDashboard';
import SiteEngineerDashboard from '../components/SiteEngineerDashboard';
import AdminPortal from './AdminPortal';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (currentUser?.role === 'admin') {
    return <Navigate to="/portal/admin" replace />;
  }

  if (currentUser?.role === 'site_engineer') {
    return <SiteEngineerDashboard />;
  }

  // Default to PM Dashboard for project_manager, ceo, etc. (until Client Portal is built)
  return <PMDashboard />;
};

export default Dashboard;
