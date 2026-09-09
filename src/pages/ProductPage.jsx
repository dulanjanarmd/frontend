import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion } from 'framer-motion';
import { Layers, Shield, Zap, BarChart } from 'lucide-react';

const ProductPage = () => {
  const features = [
    { title: 'Real-time Tracking', desc: 'Monitor construction progress instantly with live updates and dynamic gantt charts.', icon: <Zap className="w-6 h-6 text-primary" /> },
    { title: 'Unmatched Security', desc: 'Enterprise-grade encryption keeps your blueprints, contracts, and bids safe.', icon: <Shield className="w-6 h-6 text-primary" /> },
    { title: 'Advanced Analytics', desc: 'Powerful dashboards turning site data into actionable insights for stakeholders.', icon: <BarChart className="w-6 h-6 text-primary" /> },
    { title: 'Seamless Integration', desc: 'Connects perfectly with Autodesk, Procore, and your existing toolchain.', icon: <Layers className="w-6 h-6 text-primary" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Hero Section */}
      <div className="bg-[#e5e7eb] rounded-b-[3rem] pb-24 relative px-4 sm:px-8 overflow-hidden">
        <PublicNavbar />
        
        <div className="max-w-4xl mx-auto text-center pt-16 pb-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            The Ultimate <span className="text-primary block mt-2">Productivity Engine</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Prismo is the only end-to-end platform designed specifically for modern construction management. Say goodbye to spreadsheets and fragmented tools.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="px-8 py-4 bg-[#1e293b] text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#cbd5e1]/50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to build faster</h2>
          <p className="text-slate-500 text-lg">Built from the ground up for site managers and stakeholders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
