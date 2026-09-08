import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const headers = {
      'Authorization': `Bearer ${currentUser.token}`,
      'Content-Type': 'application/json'
    };

    const loadData = async () => {
      try {
        const pRes = await fetch('http://localhost:8080/api/projects', { headers });
        if (pRes.ok) {
          const rawP = await pRes.json();
          setProjects(rawP.map(p => ({
            ...p,
            progress: p.progressPercentage,
            client: p.client?.name || 'Unknown'
          })));
        }

        const uRes = await fetch('http://localhost:8080/api/users', { headers });
        if (uRes.ok) {
          const rawU = await uRes.json();
          setUsers(rawU.map(u => ({
            ...u,
            id: `u${u.id}`,
            role: u.role.toLowerCase()
          })));
        }

        const tRes = await fetch('http://localhost:8080/api/tasks', { headers });
        if (tRes.ok) {
          const rawT = await tRes.json();
          setTasks(rawT.map(t => ({
            ...t,
            projectId: `p${t.project?.id}`,
            assignedTo: `u${t.assignee?.id}`,
            evidence: t.completionEvidence
          })));
        }

        const lRes = await fetch('http://localhost:8080/api/progress', { headers });
        if (lRes.ok) {
          const rawL = await lRes.json();
          setLogs(rawL.map(l => ({
            ...l,
            projectId: `p${l.project?.id}`,
            submittedBy: `u${l.siteEngineer?.id}`
          })));
        }

        const aRes = await fetch('http://localhost:8080/api/client/approvals', { headers });
        if (aRes.ok) {
          const rawA = await aRes.json();
          setApprovals(rawA.map(a => ({
            ...a,
            projectId: `p${a.project?.id}`,
            documentUrl: '#'
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    loadData();
  }, [currentUser]);

  const addProject = async (projectData) => {
    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      const newProject = await response.json();
      
      // Update local state with the new project from backend
      setProjects([...projects, { 
        ...newProject, 
        progress: newProject.progressPercentage,
        client: newProject.client?.name || 'Unknown' 
      }]);
      
      return newProject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  const updateProject = (id, updates) => setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  
  const addTask = (task) => setTasks([...tasks, { ...task, id: `t${Date.now()}` }]);
  const updateTask = (id, updates) => setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));

  const addLog = (log) => setLogs([...logs, { ...log, id: `l${Date.now()}` }]);

  const updateApproval = (id, updates) => setApprovals(approvals.map(a => a.id === id ? { ...a, ...updates } : a));
  const addApprovalRequest = (request) => setApprovals([...approvals, { ...request, id: `a${Date.now()}` }]);

  const addConsultation = (consultation) => setConsultations([...consultations, { ...consultation, id: `c${Date.now()}` }]);
  const updateConsultation = (id, updates) => setConsultations(consultations.map(c => c.id === id ? { ...c, ...updates } : c));

  const addIssue = (issue) => setIssues([...issues, { ...issue, id: `i${Date.now()}` }]);
  const updateIssue = (id, updates) => setIssues(issues.map(i => i.id === id ? { ...i, ...updates } : i));

  const value = {
    projects, addProject, updateProject,
    tasks, addTask, updateTask,
    logs, addLog,
    approvals, updateApproval, addApprovalRequest,
    consultations, addConsultation, updateConsultation,
    users,
    issues, addIssue, updateIssue
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
