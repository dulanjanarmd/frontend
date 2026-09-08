import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, FileText, Send, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectApprovalsTab = ({ projectId, project }) => {
  const { approvals, updateApproval, addApprovalRequest } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const isClient = currentUser?.role === 'client';
  const isPM = currentUser?.role === 'project_manager' || currentUser?.role === 'pm';

  // Filter approvals for this project
  const projectApprovals = approvals.filter(a =>
    String(a.projectId) === String(projectId) || a.projectId === `p${projectId}`
  );

  const pendingCount = projectApprovals.filter(a => a.status === 'Pending').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    addApprovalRequest({
      ...formData,
      projectId,
      documentUrl: '#',
      status: 'Pending',
      feedback: '',
      dateRequested: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  const handleAction = (id, status) => {
    const feedback = window.prompt(`Any feedback for marking this as ${status}?`);
    updateApproval(id, { status, feedback: feedback || '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Client Approvals</h2>
          <p className="text-sm text-slate-500">
            {projectApprovals.length} total requests
            {pendingCount > 0 && <span className="ml-2 text-amber-600 font-semibold">• {pendingCount} pending</span>}
          </p>
        </div>
        {isPM && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-bold"
          >
            <Send className="w-4 h-4 mr-2" />
            Request Approval
          </button>
        )}
      </div>

      {projectApprovals.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No approval requests yet.</p>
          <p className="text-sm mt-1">Create approval requests to get client sign-off on key decisions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projectApprovals.map((approval, index) => (
            <motion.div
              key={approval.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <FileText className="w-4 h-4" />
                    <span>{approval.dateRequested}</span>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center ${
                    approval.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    approval.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {approval.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                    {approval.status === 'Approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {approval.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {approval.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{approval.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{approval.description}</p>

                {approval.feedback && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md border border-border mt-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Client Feedback:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{approval.feedback}</p>
                  </div>
                )}
              </div>

              {isClient && approval.status === 'Pending' && (
                <div className="flex space-x-3 pt-4 border-t border-border mt-4">
                  <button
                    onClick={() => handleAction(approval.id, 'Approved')}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(approval.id, 'Rejected')}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-md transition-colors text-sm font-medium border border-border"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Request Approval Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-2">Request Client Approval</h2>
              <p className="text-sm text-slate-500 mb-6">For: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.name}</span></p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="e.g. Foundation Design Approval" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea required rows="4" placeholder="Provide context and details for the client to review..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
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

export default ProjectApprovalsTab;
