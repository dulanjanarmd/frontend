import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter, Eye, AlertTriangle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskDetailModal from './TaskDetailModal';

const STATUS_COLUMNS = ['To Do', 'In Progress', 'Completed', 'Reopened', 'Closed'];

const STATUS_DOT = {
  'To Do': 'bg-slate-400',
  'In Progress': 'bg-amber-400',
  'Completed': 'bg-blue-500',
  'Reopened': 'bg-red-500',
  'Closed': 'bg-green-500'
};

const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-green-100 text-green-700'
};

const ProjectTasksTab = ({ projectId, project }) => {
  const { tasks, addTask, users } = useData();
  const { currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  const [formData, setFormData] = useState({
    title: '', description: '', assignedTo: '',
    priority: 'Medium', dueDate: '', milestoneId: ''
  });

  const isPM = currentUser?.role === 'project_manager' || currentUser?.role === 'pm';
  const isSiteEngineer = currentUser?.role === 'site_engineer';

  const siteEngineers = users.filter(u => u.role === 'site_engineer');
  const milestones = project?.milestones || [];

  // Filter tasks for this project
  const projectTasks = tasks.filter(t =>
    String(t.projectId) === String(projectId) || t.projectId === `p${projectId}`
  );

  // Apply filters
  const filtered = useMemo(() => {
    return projectTasks.filter(t => {
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchAssignee = assigneeFilter === 'All' || t.assignedTo === assigneeFilter;
      // Site Engineers only see their own tasks
      if (isSiteEngineer) {
        return t.assignedTo === currentUser.id || t.assignedTo === `u${currentUser.id}`;
      }
      return matchStatus && matchAssignee;
    });
  }, [projectTasks, statusFilter, assigneeFilter, isSiteEngineer, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({
      ...formData,
      projectId,
      milestoneId: formData.milestoneId || null,
      status: 'To Do',
      evidence: null
    });
    setIsModalOpen(false);
    setFormData({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '', milestoneId: '' });
  };

  // Count per column
  const columnCounts = STATUS_COLUMNS.reduce((acc, s) => {
    acc[s] = projectTasks.filter(t => t.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Task Board</h2>
          <p className="text-sm text-slate-500">{projectTasks.length} tasks — {columnCounts['Closed']} closed</p>
        </div>
        {isPM && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-bold shrink-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </button>
        )}
      </div>

      {/* Filters */}
      {isPM && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary outline-none"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUS_COLUMNS.map(s => (
                <option key={s} value={s}>{s} ({columnCounts[s]})</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary outline-none"
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
            >
              <option value="All">All Assignees</option>
              {siteEngineers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:grid-cols-5">
        {STATUS_COLUMNS.map(col => {
          const colTasks = filtered.filter(t => t.status === col);
          return (
            <div key={col} className="glass-card p-4 flex flex-col bg-slate-50/50  min-h-[200px]">
              <h3 className="font-bold text-sm mb-4 flex items-center border-b border-border pb-3">
                <span className={`w-2.5 h-2.5 rounded-full mr-2 ${STATUS_DOT[col]}`} />
                {col}
                <span className="ml-auto text-xs font-medium text-slate-400 bg-white  px-1.5 py-0.5 rounded-full border border-border">
                  {colTasks.length}
                </span>
              </h3>

              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Empty</p>
                ) : (
                  colTasks.map((task, index) => {
                    const assignee = users.find(u => u.id === task.assignedTo || `u${u.id}` === task.assignedTo);
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white  p-3 rounded-lg shadow-sm border border-border cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-1.5 py-0.5 text-xs font-semibold rounded ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES['Medium']}`}>
                            {task.priority}
                          </span>
                          {task.status === 'Completed' && !task.evidence && isPM && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" title="Needs review" />
                          )}
                          {task.status === 'Closed' && (
                            <Lock className="w-3.5 h-3.5 text-green-500" title="Closed" />
                          )}
                        </div>

                        <h4 className="font-semibold text-sm text-slate-900  leading-tight mb-2">{task.title}</h4>

                        {task.description && (
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                          <div className="flex items-center gap-1.5">
                            {assignee && (
                              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">
                                {assignee.name?.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs text-slate-500 truncate max-w-[80px]">{assignee?.name || '—'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {task.dueDate && (
                              <span className="text-xs text-slate-400">{task.dueDate}</span>
                            )}
                            <Eye className="w-3.5 h-3.5 text-slate-300 hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <span className="text-xl">×</span>
              </button>
              <h2 className="text-xl font-bold mb-1">Create New Task</h2>
              <p className="text-sm text-slate-500 mb-5">For: <span className="font-semibold text-slate-700 ">{project?.name}</span></p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="e.g. Install foundation shuttering" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea rows="3" placeholder="Detailed instructions for the site engineer..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                {/* Milestone link */}
                {milestones.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Link to Milestone (optional)</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.milestoneId} onChange={e => setFormData({ ...formData, milestoneId: e.target.value })}>
                      <option value="">No milestone link</option>
                      {milestones.map(m => (
                        <option key={m.id} value={m.id}>{m.name || m.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Assign To <span className="text-red-500">*</span></label>
                    <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.assignedTo} onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}>
                      <option value="" disabled>Select Engineer</option>
                      {siteEngineers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-slate-100 :bg-slate-800 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Create & Assign</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          project={project}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default ProjectTasksTab;
