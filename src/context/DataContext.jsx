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
          const mapTaskStatus = (s) => {
            if (s === 'TO_DO') return 'To Do';
            if (s === 'IN_PROGRESS') return 'In Progress';
            if (s === 'COMPLETED') return 'Completed';
            return s || 'To Do';
          };
          setTasks(rawT.map(t => ({
            ...t,
            status: mapTaskStatus(t.status),
            projectId: `p${t.project?.id}`,
            assignedTo: `u${t.assignee?.id}`,
            milestoneId: t.milestone?.id,
            milestoneName: t.milestone?.name || t.milestone?.title || null,
            evidence: t.completionEvidence
          })));
        }

        const lRes = await fetch('http://localhost:8080/api/progress', { headers });
        if (lRes.ok) {
          const rawL = await lRes.json();
          setLogs(rawL.map(l => ({
            ...l,
            projectId: `p${l.project?.id}`,
            submittedBy: `u${l.siteEngineer?.id}`,
            photos: l.photos || []
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
  const deleteProject = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  const addTask = (task) => setTasks([...tasks, { ...task, id: `t${Date.now()}` }]);
  const updateTask = (id, updates) => setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));

  const addLog = async (log) => {
    try {
      const projectId = String(log.projectId).replace('p', '');
      const body = {
        date: log.date,
        weather: log.weather,
        manpower: log.manpower,
        workDone: log.workDone,
        percentageCompleted: log.percentageCompleted,
        issues: log.issues || null,
        equipmentUsed: log.equipmentUsed || null,
        materialsDelivered: log.materialsDelivered || null,
        safetyIncidents: log.safetyIncidents || null,
        delayHours: log.delayHours ? parseInt(log.delayHours) : null,
        temperature: log.temperature ? parseFloat(log.temperature) : null,
        projectId: parseInt(projectId),
        photos: log.photos ? log.photos.map(p => ({
          fileUrl: p.url,
          caption: p.caption
        })) : []
      };
      
      let url = `http://localhost:8080/api/progress?projectId=${projectId}`;
      if (log.taskId) {
        url += `&taskId=${String(log.taskId).replace('t', '')}`;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const newLog = await res.json();
        setLogs(prev => [...prev, {
          ...newLog,
          projectId: `p${newLog.project?.id}`,
          submittedBy: `u${newLog.siteEngineer?.id}`,
          photos: log.photos || []
        }]);
      } else {
        // Fallback to local state if backend fails
        setLogs(prev => [...prev, { ...log, id: `l${Date.now()}`, photos: log.photos || [] }]);
      }
    } catch (err) {
      console.error('Failed to save log:', err);
      setLogs(prev => [...prev, { ...log, id: `l${Date.now()}`, photos: log.photos || [] }]);
    }
  };

  const updateApproval = (id, updates) => setApprovals(approvals.map(a => a.id === id ? { ...a, ...updates } : a));
  const addApprovalRequest = (request) => setApprovals([...approvals, { ...request, id: `a${Date.now()}` }]);

  const addConsultation = (consultation) => setConsultations([...consultations, { ...consultation, id: `c${Date.now()}` }]);
  const updateConsultation = (id, updates) => setConsultations(consultations.map(c => c.id === id ? { ...c, ...updates } : c));

  const addIssue = (issue) => setIssues([...issues, { ...issue, id: `i${Date.now()}` }]);
  const updateIssue = (id, updates) => setIssues(issues.map(i => i.id === id ? { ...i, ...updates } : i));

  const value = {
    projects, addProject, updateProject, deleteProject,
    tasks, addTask, updateTask,
    logs, addLog,
    approvals, updateApproval, addApprovalRequest,
    consultations, addConsultation, updateConsultation,
    users,
    issues, addIssue, updateIssue
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
