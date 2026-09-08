import React from 'react';
import { useAuth } from '../context/AuthContext';
import PMDashboard from '../components/PMDashboard';
import SiteEngineerDashboard from '../components/SiteEngineerDashboard';
import ClientDashboard from '../components/ClientDashboard';
import CEODashboard from '../components/CEODashboard';
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

  if (currentUser?.role === 'client') {
    return <ClientDashboard />;
  }

  if (currentUser?.role === 'ceo') {
    return <CEODashboard />;
  }

  // Default to PM Dashboard for project_manager, etc.
  return <PMDashboard />;
};

export default Dashboard;
