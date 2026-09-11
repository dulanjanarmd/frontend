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
            client: p.client?.name || 'Unknown',
            clientId: p.client?.id ? `u${p.client.id}` : null
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
            clientId: a.client?.id ? `u${a.client.id}` : null,
            status: a.status ? (a.status.charAt(0) + a.status.slice(1).toLowerCase()) : 'Pending',
            documentUrl: '#'
          })));
        }

        const iRes = await fetch('http://localhost:8080/api/issues', { headers });
        if (iRes.ok) {
          const rawI = await iRes.json();
          setIssues(rawI.map(i => ({
            ...i,
            projectId: `p${i.project?.id}`,
            reportedBy: `u${i.reportedBy?.id}`
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
          fileUrl: p.url || p.fileUrl,
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
        setLogs(prev => [...prev, { ...log, id: `l${Date.now()}`, photos: log.photos || [] }]);
      }
    } catch (err) {
      console.error('Failed to save log:', err);
      setLogs(prev => [...prev, { ...log, id: `l${Date.now()}`, photos: log.photos || [] }]);
    }
  };

  const updateLog = async (id, updatedLog) => {
    try {
      const projectId = String(updatedLog.projectId).replace('p', '');
      const rawId = String(id).replace('l', '');
      const body = {
        date: updatedLog.date,
        weather: updatedLog.weather,
        manpower: updatedLog.manpower,
        workDone: updatedLog.workDone,
        percentageCompleted: updatedLog.percentageCompleted,
        issues: updatedLog.issues || null,
        equipmentUsed: updatedLog.equipmentUsed || null,
        materialsDelivered: updatedLog.materialsDelivered || null,
        safetyIncidents: updatedLog.safetyIncidents || null,
        delayHours: updatedLog.delayHours ? parseInt(updatedLog.delayHours) : null,
        temperature: updatedLog.temperature ? parseFloat(updatedLog.temperature) : null,
        projectId: parseInt(projectId),
        photos: updatedLog.photos ? updatedLog.photos.map(p => ({
          fileUrl: p.url || p.fileUrl,
          caption: p.caption
        })) : []
      };
      
      let url = `http://localhost:8080/api/progress/${rawId}`;
      if (updatedLog.taskId) {
        url += `?taskId=${String(updatedLog.taskId).replace('t', '')}`;
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const savedLog = await res.json();
        setLogs(logs.map(l => l.id === id ? {
          ...savedLog,
          projectId: `p${savedLog.project?.id}`,
          submittedBy: `u${savedLog.siteEngineer?.id}`,
          photos: updatedLog.photos || []
        } : l));
      } else {
        setLogs(logs.map(l => l.id === id ? { ...l, ...updatedLog } : l));
      }
    } catch (err) {
      console.error('Failed to update log:', err);
      setLogs(logs.map(l => l.id === id ? { ...l, ...updatedLog } : l));
    }
  };

  const deleteLog = async (id) => {
    try {
      const rawId = String(id).replace('l', '');
      await fetch(`http://localhost:8080/api/progress/${rawId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      setLogs(logs.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  const addIssue = async (issue) => {
    try {
      const projectId = String(issue.projectId).replace('p', '');
      const body = {
        title: issue.title,
        description: issue.description,
        severity: issue.severity || 'Medium',
        status: issue.status || 'OPEN',
        location: issue.location || null,
        equipmentInvolved: issue.equipmentInvolved || null,
        estimatedDelayDays: issue.estimatedDelayDays ? parseInt(issue.estimatedDelayDays) : null,
        photoUrl: issue.photoUrl || null
      };
      
      let url = `http://localhost:8080/api/issues?projectId=${projectId}`;
      if (issue.taskId) {
        url += `&taskId=${String(issue.taskId).replace('t', '')}`;
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
        const newIssue = await res.json();
        setIssues([...issues, {
          ...newIssue,
          projectId: `p${newIssue.project?.id}`,
          reportedBy: `u${newIssue.reportedBy?.id}`
        }]);
      } else {
        setIssues([...issues, { ...issue, id: `i${Date.now()}` }]);
      }
    } catch (err) {
      console.error('Failed to report issue:', err);
      setIssues([...issues, { ...issue, id: `i${Date.now()}` }]);
    }
  };
  
  const updateIssue = async (id, updates) => {
    try {
      const rawId = String(id).replace('i', '');
      const res = await fetch(`http://localhost:8080/api/issues/${rawId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setIssues(prev => prev.map(i => String(i.id) === String(id) || String(i.id) === `i${rawId}` ? { ...i, ...updated } : i));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteIssue = async (id) => {
    try {
      const rawId = String(id).replace('i', '');
      const res = await fetch(`http://localhost:8080/api/issues/${rawId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        setIssues(prev => prev.filter(i => String(i.id) !== String(id) && String(i.id) !== `i${rawId}`));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getIssueComments = async (issueId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/issues/${issueId}/comments`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      return res.ok ? await res.json() : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const addIssueComment = async (issueId, comment) => {
    try {
      const res = await fetch(`http://localhost:8080/api/issues/${issueId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
      });
      return res.ok ? await res.json() : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getIssueMeetings = async (issueId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/issues/${issueId}/meetings`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      return res.ok ? await res.json() : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const addIssueMeeting = async (issueId, meeting) => {
    try {
      const res = await fetch(`http://localhost:8080/api/issues/${issueId}/meetings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meeting)
      });
      return res.ok ? await res.json() : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateIssueStatus = async (issueId, status, assigneeId = null) => {
    try {
      let url = `http://localhost:8080/api/issues/${issueId}/status?status=${status}`;
      if (assigneeId) url += `&assigneeId=${assigneeId}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setIssues(prev => prev.map(i => String(i.id) === String(issueId) || String(i.id) === `i${issueId}` ? { ...i, status: updated.status, assignee: updated.assignee } : i));
      }
    } catch (err) { console.error(err); }
  };

  const updateApproval = async (id, updates) => {
    // Optimistically update local state
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    try {
      // Mirror to backend (strip prefix if any)
      const numId = typeof id === 'string' ? id.replace('a', '') : id;
      await fetch(`http://localhost:8080/api/client/approvals/${numId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: updates.status })
      });
    } catch (err) { console.error('updateApproval:', err); }
  };

  const addApprovalRequest = async (request) => {
    // Optimistically add to local state
    const tempId = `a${Date.now()}`;
    setApprovals(prev => [...prev, { ...request, id: tempId }]);
    try {
      const numProjectId = typeof request.projectId === 'string'
        ? parseInt(request.projectId.replace('p', ''))
        : request.projectId;
      const res = await fetch('http://localhost:8080/api/client/approvals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: request.title,
          description: request.description,
          projectId: numProjectId,
          status: 'PENDING',
          dateRequested: new Date().toISOString().split('T')[0]
        })
      });
      if (res.ok) {
        const saved = await res.json();
        // Replace temp entry with saved one
        setApprovals(prev => prev.map(a => a.id === tempId ? {
          ...saved,
          projectId: `p${saved.project?.id}`,
          clientId: saved.client?.id ? `u${saved.client.id}` : null,
          status: saved.status ? (saved.status.charAt(0) + saved.status.slice(1).toLowerCase()) : 'Pending',
          documentUrl: '#'
        } : a));
      }
    } catch (err) { console.error('addApprovalRequest:', err); }
  };

  const addConsultation = (consultation) => setConsultations([...consultations, { ...consultation, id: `c${Date.now()}` }]);
  const updateConsultation = (id, updates) => setConsultations(consultations.map(c => c.id === id ? { ...c, ...updates } : c));

  const getGlobalMessages = async (projectId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/messages/${projectId}`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      return res.ok ? await res.json() : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const sendGlobalMessage = async (projectId, messageText) => {
    try {
      const res = await fetch(`http://localhost:8080/api/messages/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messageText })
      });
      return res.ok ? await res.json() : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const value = {
    projects, addProject, updateProject, deleteProject,
    tasks, addTask, updateTask,
    logs, addLog, updateLog, deleteLog,
    approvals, updateApproval, addApprovalRequest,
    consultations, addConsultation, updateConsultation,
    users,
    issues, addIssue, updateIssue, deleteIssue, getIssueComments, addIssueComment, getIssueMeetings, addIssueMeeting, updateIssueStatus,
    getGlobalMessages, sendGlobalMessage
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
