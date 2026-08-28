import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const { projects, addProject } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({
      ...formData,
      status: 'Planning',
      progress: 0,
      milestones: []
    });
    setIsModalOpen(false);
    setFormData({ name: '', client: '', location: '', startDate: '', endDate: '', description: '' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Projects Management
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Project Name</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Timeline</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{project.name}</td>
                  <td className="px-6 py-4 text-slate-500">{project.client}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {project.startDate} - {project.endDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'In Progress' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 max-w-[100px]">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{project.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6">Create New Project</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Client</label>
                    <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input required type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input required type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea rows="3" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors">Create Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
