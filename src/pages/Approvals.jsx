import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, FileText, Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Approvals = () => {
  const { approvals, updateApproval, addApprovalRequest, projects } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
  });

  const isClient = currentUser?.role === 'client';
  const isPM = currentUser?.role === 'pm';

  const handleSubmit = (e) => {
    e.preventDefault();
    addApprovalRequest({
      ...formData,
      documentUrl: '#',
      status: 'Pending',
      feedback: '',
      dateRequested: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    setFormData({ projectId: '', title: '', description: '' });
  };

  const handleAction = (id, status) => {
    const feedback = window.prompt(`Any feedback for marking this as ${status}?`);
    updateApproval(id, { status, feedback: feedback || '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          {isClient ? 'My Approvals' : 'Client Approvals'}
        </h1>
        {isPM && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
            <Send className="w-4 h-4 mr-2" />
            Request Approval
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {approvals.map((approval, index) => {
          const project = projects.find(p => p.id === approval.projectId);
          
          return (
            <motion.div 
              key={approval.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                    <FileText className="w-4 h-4" />
                    <span>{project?.name || 'Unknown Project'}</span>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center ${
                    approval.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    approval.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {approval.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                    {approval.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{approval.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{approval.description}</p>
                <div className="text-xs text-slate-500 mb-6">
                  Requested on: {approval.dateRequested}
                </div>
                
                {approval.feedback && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md mb-6 border border-border">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Client Feedback:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{approval.feedback}</p>
                  </div>
                )}
              </div>

              {isClient && approval.status === 'Pending' && (
                <div className="flex space-x-3 pt-4 border-t border-border">
                  <button 
                    onClick={() => handleAction(approval.id, 'Approved')}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm font-medium shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(approval.id, 'Rejected')}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-md transition-colors text-sm font-medium border border-border"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}
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
              className="glass-card w-full max-w-lg p-6 relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6">Request Client Approval</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project</label>
                  <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                    <option value="" disabled>Select a project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" placeholder="e.g. Foundation Design Approval" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea required rows="3" placeholder="Provide details for the client..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Send Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Approvals;
