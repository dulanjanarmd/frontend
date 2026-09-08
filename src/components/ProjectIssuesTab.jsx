import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Plus, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
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

const STATUS_NEXT = {
  Open: 'In Progress',
  'In Progress': 'Resolved',
  Resolved: 'Open'
};

const ProjectIssuesTab = ({ project }) => {
  const { logs } = useData();
  const { currentUser } = useAuth();
  
  const isCEO = currentUser?.role === 'ceo';

  const [issues, setIssues] = useState(() => {
    // Seed from logs that reported issues for this project
    const projectId = project.id;
    const seed = logs
      .filter(l => (String(l.projectId) === String(projectId) || l.projectId === `p${projectId}`) && l.issues)
      .map((l, idx) => ({
        id: `li${idx}`,
        title: 'Site Log Issue',
        description: l.issues,
        severity: 'Medium',
        status: 'Open',
        reportedDate: l.date,
        resolution: '',
        expanded: false
      }));
    return seed;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState({ title: '', description: '', severity: 'Medium' });
  const [expandedId, setExpandedId] = useState(null);
  const [resolutionText, setResolutionText] = useState({});

  const openCount = issues.filter(i => i.status === 'Open').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  const handleAdd = (e) => {
    e.preventDefault();
    const newIssue = {
      id: `i${Date.now()}`,
      title: newForm.title,
      description: newForm.description,
      severity: newForm.severity,
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0],
      resolution: ''
    };
    setIssues([newIssue, ...issues]);
    setNewForm({ title: '', description: '', severity: 'Medium' });
    setIsAdding(false);
  };

  const advanceStatus = (id) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: STATUS_NEXT[i.status] } : i));
  };

  const saveResolution = (id) => {
    setIssues(issues.map(i => i.id === id ? { ...i, resolution: resolutionText[id] || '', status: 'Resolved' } : i));
  };

  const handleDelete = (id) => {
    setIssues(issues.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Issues & Problems</h2>
          <p className="text-sm text-slate-500">
            {openCount} open · {resolvedCount} resolved
          </p>
        </div>
        {!isCEO && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg shadow-red-500/30 font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Report Issue
          </button>
        )}
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 flex-wrap">
        {['Open', 'In Progress', 'Resolved'].map(s => {
          const count = issues.filter(i => i.status === s).length;
          return (
            <div key={s} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${STATUS_STYLES[s]} border-current/20`}>
              {s}: {count}
            </div>
          );
        })}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="glass-card p-5 border-2 border-red-300/40 overflow-hidden"
          >
            <h3 className="font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
              Report New Issue
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Issue Title <span className="text-red-500">*</span></label>
                  <input
                    required type="text"
                    placeholder="e.g. Material delivery delayed"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                    value={newForm.title}
                    onChange={e => setNewForm({ ...newForm, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Severity</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={newForm.severity}
                    onChange={e => setNewForm({ ...newForm, severity: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  required rows="3"
                  placeholder="Describe the issue in detail..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none resize-none"
                  value={newForm.description}
                  onChange={e => setNewForm({ ...newForm, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 :bg-slate-800 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-lg shadow-red-500/20">Report Issue</button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Issues list */}
      {issues.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No issues reported. Great work!</p>
          <p className="text-sm mt-1">Issues reported by Site Engineers or the PM will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue, idx) => (
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
              {/* Issue header */}
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
                      <span className="text-xs text-slate-400">{issue.reportedDate}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 ">{issue.title}</h3>
                    <p className="text-sm text-slate-600  mt-1">{issue.description}</p>
                  </div>
                  {!isCEO && (
                    <div className="flex items-center gap-1 shrink-0">
                      {issue.status !== 'Resolved' && (
                        <button
                          onClick={() => advanceStatus(issue.id)}
                          title={`Move to ${STATUS_NEXT[issue.status]}`}
                          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors whitespace-nowrap"
                        >
                          → {STATUS_NEXT[issue.status]}
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                      >
                        {expandedId === issue.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 :bg-red-900/20 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Resolution note */}
                {issue.resolution && (
                  <div className="mt-3 bg-green-50  border border-green-200  rounded-md p-3">
                    <p className="text-xs font-semibold text-green-700  mb-1 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" /> Resolution Note
                    </p>
                    <p className="text-sm text-green-700 ">{issue.resolution}</p>
                  </div>
                )}
              </div>

              {/* Expandable: Add resolution comment */}
              <AnimatePresence>
                {expandedId === issue.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-slate-50/50  px-5 py-4 overflow-hidden"
                  >
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-slate-500" />
                      Add Resolution / Comment
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        rows="2"
                        placeholder="Describe how this was resolved or add a comment..."
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                        value={resolutionText[issue.id] || ''}
                        onChange={e => setResolutionText({ ...resolutionText, [issue.id]: e.target.value })}
                      />
                      <button
                        onClick={() => saveResolution(issue.id)}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm font-medium"
                      >
                        Save & Resolve
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectIssuesTab;
