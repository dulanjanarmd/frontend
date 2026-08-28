import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { users } from '../utils/mockData';
import { Plus, X, ListTodo, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const { tasks, addTask, updateTask, projects } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
  });

  const isPM = currentUser?.role === 'pm';
  const isSiteEngineer = currentUser?.role === 'site_engineer';
  
  // Filter tasks based on role
  const displayTasks = isSiteEngineer ? tasks.filter(t => t.assignedTo === currentUser.id) : tasks;

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({
      ...formData,
      status: 'To Do',
      evidence: null
    });
    setIsModalOpen(false);
    setFormData({ projectId: '', title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
  };

  const handleStatusUpdate = (id, newStatus) => {
    let evidence = null;
    if (newStatus === 'Completed') {
      const url = window.prompt("Enter evidence photo URL or leave blank:");
      if (url) evidence = url;
    }
    updateTask(id, { status: newStatus, evidence });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          {isSiteEngineer ? 'My Tasks' : 'Task Management'}
        </h1>
        {isPM && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Assign Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Completed'].map(columnStatus => (
          <div key={columnStatus} className="glass-card p-4 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="font-bold text-lg mb-4 flex items-center border-b border-border pb-2">
              <span className={`w-3 h-3 rounded-full mr-2 ${
                columnStatus === 'To Do' ? 'bg-slate-400' : 
                columnStatus === 'In Progress' ? 'bg-amber-400' : 'bg-green-500'
              }`}></span>
              {columnStatus}
            </h2>
            
            <div className="space-y-4 flex-1">
              {displayTasks.filter(t => t.status === columnStatus).map((task, index) => {
                const project = projects.find(p => p.id === task.projectId);
                const assignee = users.find(u => u.id === task.assignedTo);
                
                return (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm border border-border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{task.dueDate}</span>
                    </div>
                    
                    <h4 className="font-bold mb-1">{task.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{task.description}</p>
                    
                    <div className="flex items-center text-xs text-slate-500 mb-4 border-t border-border pt-2 mt-2">
                      <ListTodo className="w-3 h-3 mr-1" />
                      {project?.name}
                    </div>

                    {isPM && (
                      <div className="text-xs text-slate-500 mb-3">
                        Assigned to: <span className="font-medium text-slate-700 dark:text-slate-200">{assignee?.name}</span>
                      </div>
                    )}

                    {task.evidence && (
                      <div className="mt-2 mb-3">
                        <p className="text-xs font-medium mb-1 flex items-center text-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Evidence
                        </p>
                        <img src={task.evidence} alt="Task Evidence" className="w-full h-24 object-cover rounded border border-border" />
                      </div>
                    )}

                    {isSiteEngineer && columnStatus !== 'Completed' && (
                      <div className="flex space-x-2 pt-2">
                        {columnStatus === 'To Do' && (
                          <button onClick={() => handleStatusUpdate(task.id, 'In Progress')} className="flex-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-medium transition-colors">Start Work</button>
                        )}
                        {columnStatus === 'In Progress' && (
                          <button onClick={() => handleStatusUpdate(task.id, 'Completed')} className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors">Mark Complete</button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6">Assign New Task</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project</label>
                  <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                    <option value="" disabled>Select a project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title</label>
                  <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea required rows="3" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Assign To</label>
                    <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                      <option value="" disabled>Select Engineer</option>
                      {users.filter(u => u.role === 'site_engineer').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input required type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Assign Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
