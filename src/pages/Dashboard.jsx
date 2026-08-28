import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Building2, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 flex items-center space-x-4"
  >
    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </motion.div>
);

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index }}
    className="glass-card p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow cursor-pointer relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-bl-full -z-10"></div>
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold">{project.name}</h4>
          <p className="text-sm text-slate-500">{project.client}</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          project.status === 'In Progress' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {project.status}
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{project.description}</p>
    </div>
    
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700 dark:text-slate-200">Progress</span>
        <span className="text-primary font-bold">{project.progress}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${project.progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
        ></motion.div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { projects } = useData();
  const { currentUser } = useAuth();

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalProjects = projects.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome back, {currentUser?.name}. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value={activeProjects} icon={Building2} delay={0.1} />
        <StatCard title="Total Projects" value={totalProjects} icon={TrendingUp} delay={0.2} />
        <StatCard title="Pending Approvals" value="3" icon={AlertCircle} delay={0.3} />
        <StatCard title="Upcoming Milestones" value="2" icon={Clock} delay={0.4} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
