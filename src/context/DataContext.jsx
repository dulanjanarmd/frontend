import React, { createContext, useContext, useState } from 'react';
import { initialProjects, initialTasks, initialLogs, initialClientApprovals } from '../utils/mockData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [logs, setLogs] = useState(initialLogs);
  const [approvals, setApprovals] = useState(initialClientApprovals);

  const addProject = (project) => setProjects([...projects, { ...project, id: `p${Date.now()}` }]);
  const updateProject = (id, updates) => setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  
  const addTask = (task) => setTasks([...tasks, { ...task, id: `t${Date.now()}` }]);
  const updateTask = (id, updates) => setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));

  const addLog = (log) => setLogs([...logs, { ...log, id: `l${Date.now()}` }]);

  const updateApproval = (id, updates) => setApprovals(approvals.map(a => a.id === id ? { ...a, ...updates } : a));
  const addApprovalRequest = (request) => setApprovals([...approvals, { ...request, id: `a${Date.now()}` }]);

  const value = {
    projects, addProject, updateProject,
    tasks, addTask, updateTask,
    logs, addLog,
    approvals, updateApproval, addApprovalRequest
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
