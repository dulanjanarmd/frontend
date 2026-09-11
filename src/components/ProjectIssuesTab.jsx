import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Plus, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  const { issues, updateIssueStatus } = useData();
  const { currentUser } = useAuth();
  
  const isCEO = currentUser?.role === 'ceo';
  const navigate = useNavigate();

  // Filter global issues to only those belonging to this project
  const projectIssues = issues.filter(i => 
    String(i.projectId) === String(project.id) || i.projectId === `p${project.id}`
  );

  const [expandedId, setExpandedId] = useState(null);

  const openCount = projectIssues.filter(i => i.status === 'Open').length;
  const resolvedCount = projectIssues.filter(i => i.status === 'Resolved').length;

  const advanceStatus = (id) => {
    const issue = projectIssues.find(i => i.id === id);
    if (issue) {
      updateIssueStatus(id, STATUS_NEXT[issue.status]);
    }
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
            onClick={() => navigate('/portal/issues')}
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
          const count = projectIssues.filter(i => i.status === s).length;
          return (
            <div key={s} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${STATUS_STYLES[s]} border-current/20`}>
              {s}: {count}
            </div>
          );
        })}
      </div>

      {/* Issues list */}
      {projectIssues.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No issues reported. Great work!</p>
          <p className="text-sm mt-1">Issues reported by Site Engineers or the PM will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projectIssues.map((issue, idx) => (
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

              {/* Expandable: Show Details */}
              <AnimatePresence>
                {expandedId === issue.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-slate-50/50 px-5 py-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-500 block mb-1">Location / Area</span>
                        <span className="font-medium text-slate-900">{issue.location || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Equipment Involved</span>
                        <span className="font-medium text-slate-900">{issue.equipmentInvolved || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Estimated Delay</span>
                        <span className="font-medium text-slate-900">{issue.estimatedDelayDays ? `${issue.estimatedDelayDays} Days` : 'Unknown'}</span>
                      </div>
                      {issue.photoUrl && (
                        <div>
                          <span className="text-slate-500 block mb-1">Attached Document</span>
                          <a href={issue.photoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">View File</a>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => navigate('/portal/issues')}
                      className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md transition-colors text-sm font-semibold flex items-center justify-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Full Discussion in Global Issues
                    </button>
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
