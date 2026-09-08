import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Plus, ChevronDown, ChevronUp, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEVERITY_STYLES = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-blue-100 text-blue-700 border-blue-200'
};

const STATUS_STYLES = {
  Open: 'bg-red-50 text-red-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  Resolved: 'bg-green-50 text-green-600'
};

const Issues = () => {
  const { issues, addIssue, projects } = useData();
  const { currentUser } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    severity: 'Medium',
    photoUrl: ''
  });

  const [expandedId, setExpandedId] = useState(null);

  // Get projects the engineer is assigned to (simplified for demo)
  const myProjects = projects; // In a real app, filter by assignment

  // Get issues reported by this engineer (or just show all for demo if no reporter ID is saved yet, 
  // but let's assume they want to see all issues for their projects)
  const myIssues = (issues || []).sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate));

  const openCount = myIssues.filter(i => i.status === 'Open').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIssue = {
      projectId: formData.projectId,
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0],
      resolution: '',
      photoUrl: formData.photoUrl
    };
    
    addIssue(newIssue);
    setFormData({ projectId: '', title: '', description: '', severity: 'Medium', photoUrl: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Site Issues
          </h1>
          <p className="text-slate-500 mt-1">{openCount} open issues require attention.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg shadow-red-500/30 font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Report Issue
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 border-2 border-red-300/40 overflow-hidden"
          >
            <h3 className="font-semibold mb-4 flex items-center text-lg">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Report New Issue
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project <span className="text-red-500">*</span></label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.projectId}
                    onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                  >
                    <option value="" disabled>Select Project</option>
                    {myProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Severity <span className="text-red-500">*</span></label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: e.target.value })}
                  >
                    <option value="High">High (Immediate action required)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low (Observation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Issue Title <span className="text-red-500">*</span></label>
                <input
                  required type="text"
                  placeholder="e.g. Material delivery delayed"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  required rows="3"
                  placeholder="Describe the issue in detail..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Supporting Photo (Optional)</label>
                <input
                  type="url"
                  placeholder="Paste image URL here..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.photoUrl}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-lg shadow-red-500/20">Submit Issue</button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Issues list */}
      {myIssues.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No issues reported yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myIssues.map((issue, idx) => {
            const project = projects.find(p => String(p.id) === String(issue.projectId));
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`glass-card overflow-hidden border-l-4 ${
                  issue.severity === 'High' ? 'border-l-red-500' :
                  issue.severity === 'Medium' ? 'border-l-amber-400' : 'border-l-blue-400'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${SEVERITY_STYLES[issue.severity]}`}>
                          {issue.severity}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_STYLES[issue.status]}`}>
                          {issue.status}
                        </span>
                        <span className="text-xs font-medium text-slate-500">{project?.name || 'Project'}</span>
                        <span className="text-xs text-slate-400">{issue.reportedDate}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{issue.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{issue.description}</p>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors shrink-0"
                    >
                      {expandedId === issue.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === issue.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border bg-slate-50/50 dark:bg-slate-900/30 px-5 py-4 flex gap-4"
                    >
                      {issue.photoUrl && (
                        <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 border border-border">
                          <img src={issue.photoUrl} alt="Issue" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        {issue.resolution ? (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" /> PM Resolution Note
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">{issue.resolution}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Waiting for PM review...
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Issues;
