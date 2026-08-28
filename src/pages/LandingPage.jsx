import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { addConsultation } = useData();
  
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    service: 'Construction Management',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addConsultation({
      ...formData,
      status: 'New Inquiry',
      dateSubmitted: new Date().toISOString().split('T')[0],
      proposalUrl: null
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ clientName: '', email: '', phone: '', service: 'Construction Management', description: '' });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      
      {/* Top Section with light grey background and rounded bottom */}
      <div className="bg-[#e5e7eb] rounded-b-[3rem] pb-0 relative px-4 sm:px-8">
        
        {/* Navbar */}
        <header className="py-6 mx-auto w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-[#1e293b] px-4 py-2 rounded-lg flex items-center h-12">
              <span className="text-primary font-bold text-xl tracking-tight">Prismo.</span>
            </div>
            <nav className="hidden md:flex bg-[#d1d5db] h-12 rounded-lg px-2 items-center space-x-1 text-sm font-medium text-[#4b5563]">
              <div className="px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center">Product <span className="ml-1 text-[10px]">▼</span></div>
              <div className="px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center">Solution <span className="ml-1 text-[10px]">▼</span></div>
              <div className="px-4 py-2 hover:bg-[#9ca3af]/20 rounded cursor-pointer transition-colors flex items-center">Resources <span className="ml-1 text-[10px]">▼</span></div>
            </nav>
          </div>
          
          <div className="flex items-center bg-[#d1d5db] h-12 rounded-lg p-1 space-x-1 text-sm font-bold">
            <Link to="/login" className="px-6 py-2 text-[#4b5563] hover:text-[#1e293b] transition-colors uppercase">
              Sign In
            </Link>
            <a href="#contact" className="px-6 py-2 bg-primary text-[#022c22] rounded-md transition-colors uppercase h-full flex items-center hover:opacity-90">
              Book a Demo
            </a>
          </div>
        </header>

        {/* Hero Content matching the screenshot layout */}
        <div className="max-w-4xl mx-auto text-center pt-16 pb-12">

          {/* Hero Title */}
          <h1 className="text-5xl md:text-6xl font-medium text-[#1e293b] mb-8 leading-tight">
            Construction Site Management: A Practical Guide
          </h1>
          
          <p className="text-[#4b5563] font-medium mb-12">
            Prismo Constructions Platform
          </p>

        </div>

        {/* Hero Image overlapping the bottom curve */}
        <div className="max-w-5xl mx-auto relative px-4">
          <div className="relative h-[300px] md:h-[450px] w-full rounded-t-3xl overflow-hidden shadow-2xl">
            <img src="/hero-image.jpg" alt="3D Construction Site" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-8 left-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                Construction Site<br/>Management
              </h2>
              <p className="text-xl text-white/90">Insights</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content below the curved top section */}
      <main className="flex-1 bg-white pt-24 pb-24 px-4 sm:px-8">
        
        {/* Contact / Consultation Form adapted into this layout */}
        <div id="contact" className="max-w-3xl mx-auto bg-[#f8fafc] p-8 md:p-12 rounded-2xl border border-[#e2e8f0]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-3">Request a Consultation</h2>
            <p className="text-[#64748b]">Tell us about your project, and our experts will get back to you with a proposal.</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-2">Request Received!</h3>
              <p className="text-[#64748b]">Our team will review your requirements and contact you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-[#64748b]">Full Name / Company</label>
                  <input required type="text" className="w-full rounded-md bg-white border border-[#cbd5e1] px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-[#1e293b]" placeholder="e.g. Eco Resort Holdings" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-[#64748b]">Email Address</label>
                  <input required type="email" className="w-full rounded-md bg-white border border-[#cbd5e1] px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-[#1e293b]" placeholder="you@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-[#64748b]">Phone Number</label>
                  <input required type="tel" className="w-full rounded-md bg-white border border-[#cbd5e1] px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-[#1e293b]" placeholder="+94 77 ..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-[#64748b]">Interested Service</label>
                  <select className="w-full rounded-md bg-white border border-[#cbd5e1] px-4 py-3 focus:ring-2 focus:ring-primary outline-none appearance-none text-[#1e293b]" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                    <option>Consultancy & Cost Planning</option>
                    <option>Construction Management</option>
                    <option>Quality Assurance Audits</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-[#64748b]">Project Details</label>
                <textarea required rows="4" className="w-full rounded-md bg-white border border-[#cbd5e1] px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none text-[#1e293b]" placeholder="Describe your project size, location, and specific needs..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <button type="submit" className="w-full bg-primary text-[#022c22] font-bold py-4 text-sm uppercase tracking-wider rounded-md hover:opacity-90 transition-opacity">
                Submit Request
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Exact Match Footer from Screenshot */}
      <footer className="bg-[#1c2431] text-[#9ca3af] pt-16 pb-12 px-6 sm:px-12 w-full border-t border-[#374151]">
        
        {/* Subscribe Section */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 pb-12 border-b border-[#374151]">
          <h3 className="text-2xl md:text-3xl text-white font-medium mb-6 md:mb-0">
            Subscribe to receive Prismo Constructions updates & industry insights.
          </h3>
          <div className="w-full md:w-auto">
            <div className="flex bg-[#2d3748] rounded-md overflow-hidden p-1 w-full md:w-96">
              <input 
                type="email" 
                placeholder="Email address..." 
                className="bg-transparent border-none px-4 py-3 text-white focus:outline-none w-full text-sm placeholder:text-[#6b7280]" 
              />
              <button className="bg-[#9ca3af] text-[#1c2431] font-bold text-xs px-6 py-3 uppercase tracking-wider hover:bg-[#d1d5db] transition-colors rounded-sm">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] mt-3 text-[#6b7280]">
              This site is protected by reCAPTCHA and the Google <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a> apply.
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Inspection & Test Plans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Document Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Punch List Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Snag Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Defect Management</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">News & Insights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customer Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Implementation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Explore</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security & Legal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Onboarding Requests</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors underline">+61 1800 319 395</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Logo & Graphic */}
        <div className="max-w-7xl mx-auto flex items-end justify-between relative mt-24">
          <h1 className="text-6xl md:text-8xl font-bold text-[#9ca3af]/40 tracking-tighter">
            prismo
          </h1>
          
          {/* Decorative Dot Graphic (approximating the screenshot's bottom right graphic) */}
          <div className="absolute right-0 bottom-[-20px] opacity-20 pointer-events-none grid grid-cols-3 gap-2 p-2">
             <div className="w-6 h-6 bg-white rounded-full"></div>
             <div className="w-6 h-6 bg-white rounded-full"></div>
             <div className="w-6 h-6 bg-white rounded-full"></div>
             <div className="w-6 h-6 bg-white rounded-full"></div>
             <div className="w-6 h-6 bg-white rounded-lg col-start-2 row-start-2 scale-150 transform"></div>
             <div className="w-6 h-6 bg-white rounded-full"></div>
             <div className="w-6 h-6 bg-white rounded-full"></div>
             <div className="w-6 h-6 bg-white rounded-full"></div>
             <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
