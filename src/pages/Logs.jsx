import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Camera, Plus, X, UploadCloud, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Logs = () => {
  const { logs, addLog, projects } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    weather: 'Sunny',
    manpower: '',
    workDone: '',
    percentageCompleted: '',
    issues: '',
    photos: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addLog({
      ...formData,
      submittedBy: currentUser.id,
      photos: formData.photos.length ? formData.photos : ['https://images.unsplash.com/photo-1541888081622-6323c21c7e92?q=80&w=2070&auto=format&fit=crop']
    });
    setIsModalOpen(false);
    setFormData({ projectId: '', date: new Date().toISOString().split('T')[0], weather: 'Sunny', manpower: '', workDone: '', percentageCompleted: '', issues: '', photos: [] });
  };

  const isSiteEngineer = currentUser?.role === 'site_engineer';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Site Progress Logs
        </h1>
        {isSiteEngineer && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Submit Daily Log
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {logs.map(log => {
          const project = projects.find(p => p.id === log.projectId);
          return (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 flex flex-col md:flex-row gap-6"
            >
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                  <img src={log.photos[0]} alt="Progress" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{project?.name || 'Unknown Project'}</h3>
                    <p className="text-sm text-slate-500">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-semibold">
                    +{log.percentageCompleted}% Completed
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Weather</p>
                    <p className="font-medium">{log.weather}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Manpower</p>
                    <p className="font-medium">{log.manpower} Workers</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Submitted By</p>
                    <p className="font-medium capitalize">{log.submittedBy}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">Work Done:</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{log.workDone}</p>
                </div>

                {log.issues && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-500 mb-1">Reported Issue</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">{log.issues}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6">Submit Daily Progress Log</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project</label>
                    <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                      <option value="" disabled>Select a project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input required type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Weather</label>
                    <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.weather} onChange={e => setFormData({...formData, weather: e.target.value})}>
                      <option>Sunny</option>
                      <option>Cloudy</option>
                      <option>Rainy</option>
                      <option>Storm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Manpower</label>
                    <input required type="number" min="0" placeholder="e.g. 15" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.manpower} onChange={e => setFormData({...formData, manpower: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">% Completed Today</label>
                    <input required type="number" min="0" max="100" placeholder="e.g. 2" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.percentageCompleted} onChange={e => setFormData({...formData, percentageCompleted: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Work Done</label>
                  <textarea required rows="3" placeholder="Describe the work completed today..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.workDone} onChange={e => setFormData({...formData, workDone: e.target.value})}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Issues or Observations (Optional)</label>
                  <textarea rows="2" placeholder="Report any delays, material shortages, etc." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.issues} onChange={e => setFormData({...formData, issues: e.target.value})}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Progress Photos</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">Click to upload photos</p>
                    <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Submit Log</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Logs;
