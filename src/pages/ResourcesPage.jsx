import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion } from 'framer-motion';
import { FileText, BookOpen, Video, HelpCircle } from 'lucide-react';

const ResourcesPage = () => {
  const resources = [
    { type: 'Documentation', title: 'Getting Started Guide', desc: 'Everything you need to know to set up your first project.', icon: <BookOpen className="w-5 h-5" /> },
    { type: 'Case Study', title: 'Skyline Tower Project', desc: 'How Prismo saved Skyline Corp 20% in raw material waste.', icon: <FileText className="w-5 h-5" /> },
    { type: 'Video Tutorial', title: 'Advanced Gantt Charts', desc: 'Mastering timeline dependencies and resource leveling.', icon: <Video className="w-5 h-5" /> },
    { type: 'Support', title: 'Help Center & FAQs', desc: 'Browse articles or contact our 24/7 support team.', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Hero Section */}
      <div className="bg-[#e5e7eb] rounded-b-[3rem] pb-24 relative px-4 sm:px-8 overflow-hidden">
        <PublicNavbar />
        
        <div className="max-w-4xl mx-auto text-center pt-16 pb-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Learn, Grow, <span className="text-primary">&</span> Build
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
          >
            Access our library of tutorials, industry insights, and case studies to get the most out of your Prismo experience.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto relative"
          >
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="w-full px-6 py-4 rounded-full border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
            <button className="absolute right-2 top-2 bg-[#1e293b] text-white px-6 py-2 rounded-full font-bold hover:bg-primary hover:text-[#022c22] transition-colors">
              Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-primary font-bold mb-4">
                {item.icon}
                <span className="text-xs uppercase tracking-wider">{item.type}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 flex-grow">{item.desc}</p>
              <div className="mt-6 text-sm font-semibold text-[#1e293b] flex items-center hover:text-primary transition-colors">
                Read more <span className="ml-1">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
