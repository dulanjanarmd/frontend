import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion } from 'framer-motion';
import { HardHat, Users, Building, Activity } from 'lucide-react';

const SolutionPage = () => {
  const solutions = [
    { title: 'For Site Managers', desc: 'Streamline daily operations, manage sub-contractors, and ensure safety compliance effortlessly.', icon: <HardHat className="w-8 h-8 text-[#1e293b]" /> },
    { title: 'For Executives', desc: 'Get high-level portfolio views, risk assessments, and financial forecasting across all active sites.', icon: <Building className="w-8 h-8 text-[#1e293b]" /> },
    { title: 'For Field Workers', desc: 'Easy-to-use mobile interfaces for clocking in, reporting hazards, and viewing daily task assignments.', icon: <Users className="w-8 h-8 text-[#1e293b]" /> },
    { title: 'For Health & Safety', desc: 'Automated compliance tracking, incident reporting, and real-time environmental monitoring.', icon: <Activity className="w-8 h-8 text-[#1e293b]" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Hero Section */}
      <div className="bg-[#e5e7eb] rounded-b-[3rem] pb-20 relative px-4 sm:px-8 overflow-hidden">
        <PublicNavbar />
        
        <div className="max-w-5xl mx-auto text-center pt-16 pb-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Solutions for <span className="text-primary">Every Stakeholder</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Whether you are on the ground wearing a hard hat or in the boardroom analyzing budgets, Prismo adapts to give you the exact tools you need.
          </motion.p>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all group cursor-pointer overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5e7eb] rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 group-hover:bg-primary/20 z-0"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-md">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
                <div className="mt-8 flex items-center text-primary font-bold">
                  Explore solution <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;
