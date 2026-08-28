import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, X, Calendar, Edit2, Flag, Activity, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const { projects, addProject, updateProject } = useData();
  
  // Modals state
  const [modalType, setModalType] = useState(null); // 'create', 'edit', 'milestones', 'status'
  const [activeProject, setActiveProject] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', client: '', location: '', startDate: '', endDate: '', description: '' });
  const [statusData, setStatusData] = useState({ status: '', progress: 0 });
  
  // Milestone state
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '' });

  const openModal = (type, project = null) => {
    setModalType(type);
    setActiveProject(project);
    if (type === 'edit' && project) {
      setFormData(project);
    } else if (type === 'create') {
      setFormData({ name: '', client: '', location: '', startDate: '', endDate: '', description: '' });
    } else if (type === 'status' && project) {
      setStatusData({ status: project.status, progress: project.progress });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setActiveProject(null);
  };

  const handleCreateEdit = (e) => {
    e.preventDefault();
    if (modalType === 'create') {
      addProject({ ...formData, status: 'Planning', progress: 0, milestones: [] });
    } else if (modalType === 'edit') {
      updateProject(activeProject.id, formData);
    }
    closeModal();
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    updateProject(activeProject.id, { 
      status: statusData.status, 
      progress: parseInt(statusData.progress, 10) 
    });
    closeModal();
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.title || !newMilestone.date) return;
    
    const updatedMilestones = [...activeProject.milestones, { ...newMilestone, id: `m${Date.now()}`, completed: false }];
    updateProject(activeProject.id, { milestones: updatedMilestones });
    setActiveProject({ ...activeProject, milestones: updatedMilestones });
    setNewMilestone({ title: '', date: '' });
  };

  const toggleMilestone = (milestoneId) => {
    const updatedMilestones = activeProject.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    updateProject(activeProject.id, { milestones: updatedMilestones });
    setActiveProject({ ...activeProject, milestones: updatedMilestones });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Projects Management
        </h1>
        <button 
          onClick={() => openModal('create')}
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
                <th className="px-6 py-4 font-medium">Timeline</th>
                <th className="px-6 py-4 font-medium">Status & Progress</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-base text-slate-900 dark:text-slate-100">{project.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{project.client} • {project.location}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center text-xs">
                      <Calendar className="w-4 h-4 mr-2" />
                      {project.startDate} to {project.endDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full w-fit ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {project.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 max-w-[120px]">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{project.progress}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => openModal('status', project)} className="p-2 text-slate-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="Update Status">
                        <Activity className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('milestones', project)} className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md transition-colors" title="Manage Milestones">
                        <Flag className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', project)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors" title="Edit Project">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* Create / Edit Project Modal */}
        {(modalType === 'create' || modalType === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-6 relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold mb-6">{modalType === 'create' ? 'Create New Project' : 'Edit Project Details'}</h2>
              <form onSubmit={handleCreateEdit} className="space-y-4">
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
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">{modalType === 'create' ? 'Create Project' : 'Save Changes'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Update Status / Progress Modal */}
        {modalType === 'status' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-6 relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold mb-6">Update Status</h2>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={statusData.status} onChange={e => setStatusData({...statusData, status: e.target.value})}>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Overall Progress (%)</label>
                  <input type="range" min="0" max="100" className="w-full accent-primary" value={statusData.progress} onChange={e => setStatusData({...statusData, progress: e.target.value})} />
                  <div className="text-center font-bold text-primary mt-2">{statusData.progress}%</div>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Update</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Manage Milestones Modal */}
        {modalType === 'milestones' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold mb-6 flex items-center"><Flag className="w-5 h-5 mr-2 text-amber-500" /> Manage Milestones</h2>
              
              <div className="space-y-4 mb-6">
                {activeProject?.milestones.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No milestones defined yet.</p>
                ) : (
                  activeProject?.milestones.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => toggleMilestone(m.id)} className="text-slate-400 hover:text-primary transition-colors">
                          {m.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div className={m.completed ? 'opacity-50 line-through' : ''}>
                          <p className="font-semibold text-sm">{m.title}</p>
                          <p className="text-xs text-slate-500">{m.date}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold mb-3">Add New Milestone</h3>
                <form onSubmit={handleAddMilestone} className="flex gap-2">
                  <input required type="text" placeholder="Title" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} />
                  <input required type="date" className="w-40 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={newMilestone.date} onChange={e => setNewMilestone({...newMilestone, date: e.target.value})} />
                  <button type="submit" className="px-3 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"><Plus className="w-4 h-4" /></button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
