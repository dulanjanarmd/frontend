import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Bell, Calendar, CheckSquare, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientDashboard = () => {
  const { projects, approvals } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // For a real app, filter projects by assignment to the client.
  // Assuming 'client' in mock data maps somewhat to the user, but we'll show all or a subset for demo.
  const myProjects = projects.slice(0, 2); 
  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  // Summary stats
  const totalProjects = myProjects.length;
  const inProgress = myProjects.filter(p => p.status === 'In Progress').length;
  const completed = myProjects.filter(p => p.status === 'Completed').length;
  const pendingCount = pendingApprovals.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600   bg-clip-text text-transparent">
          Welcome, {currentUser?.name || 'Client'}
        </h1>
        <p className="text-slate-500 mt-2">Here is the latest overview of your investments.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 border border-border">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-slate-900 ">{totalProjects}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border border-border">
          <p className="text-sm font-medium text-slate-500 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600 ">{inProgress}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 border border-border">
          <p className="text-sm font-medium text-slate-500 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600 ">{completed}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 border border-amber-200  bg-amber-50/50 ">
          <p className="text-sm font-medium text-amber-600  mb-1">Pending Approvals</p>
          <p className="text-3xl font-bold text-amber-600 ">{pendingCount}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content (Projects) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900  flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary" />
              My Projects
            </h2>
            <button onClick={() => navigate('/portal/projects')} className="text-sm text-primary hover:underline font-medium">
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-5 cursor-pointer hover:shadow-lg transition-all border border-border group"
                onClick={() => navigate(`/portal/projects/${project.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900  group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-slate-500">{project.location || 'Location Not Specified'}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100  text-slate-700  border border-slate-200 `}>
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-primary">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100  rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-auto space-y-3">
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    Last Updated: {project.endDate || 'Recent'}
                  </div>
                  
                  <button className="w-full py-2 bg-slate-100  hover:bg-primary hover:text-white :bg-primary text-slate-700  rounded-md text-sm font-semibold transition-colors flex items-center justify-center group-hover:bg-primary group-hover:text-white">
                    View Project <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Content (Notifications & Approvals) */}
        <div className="space-y-6">
          <div className="glass-card p-5 border-t-4 border-t-amber-500">
            <h2 className="text-lg font-bold text-slate-900  mb-4 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-amber-500" />
              Action Required
            </h2>
            
            {pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 3).map(approval => (
                  <div key={approval.id} className="p-3 bg-amber-50  rounded-lg border border-amber-100 ">
                    <h4 className="font-semibold text-sm text-slate-900  mb-1">{approval.title}</h4>
                    <p className="text-xs text-slate-600  mb-3 line-clamp-2">{approval.description}</p>
                    <button 
                      onClick={() => navigate('/portal/approvals')}
                      className="text-xs font-bold text-amber-700  hover:underline"
                    >
                      Review & Respond &rarr;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>

          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-slate-900  mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Recent Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100  flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-blue-600 " />
                </div>
                <div>
                  <p className="text-sm text-slate-800 "><span className="font-semibold">Project Manager</span> uploaded a new weekly progress report for Horizon Residencies.</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100  flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4 text-green-600 " />
                </div>
                <div>
                  <p className="text-sm text-slate-800 ">Milestone <span className="font-semibold">Foundation Completed</span> was marked as done.</p>
                  <p className="text-xs text-slate-500 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
