import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, delay, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 flex items-center space-x-4"
  >
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 ">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </motion.div>
);

const PortfolioSummaryCards = ({ projects }) => {
  const totalProjects = projects.length;
  const inProgress = projects.filter(p => p.status === 'In Progress').length;
  const onHold = projects.filter(p => p.status === 'On Hold' || p.status === 'Delayed').length;
  const completed = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Projects" 
        value={totalProjects} 
        icon={Building2} 
        delay={0.1} 
        colorClass="bg-blue-100  text-blue-600 "
      />
      <StatCard 
        title="In Progress" 
        value={inProgress} 
        icon={TrendingUp} 
        delay={0.2} 
        colorClass="bg-green-100  text-green-600 "
      />
      <StatCard 
        title="On Hold / Delayed" 
        value={onHold} 
        icon={AlertCircle} 
        delay={0.3} 
        colorClass="bg-orange-100  text-orange-600 "
      />
      <StatCard 
        title="Completed" 
        value={completed} 
        icon={CheckCircle} 
        delay={0.4} 
        colorClass="bg-slate-100  text-slate-600 "
      />
    </div>
  );
};

export default PortfolioSummaryCards;
