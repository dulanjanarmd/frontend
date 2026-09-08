import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import RecentActivity from '../components/RecentActivity';
import { Activity } from 'lucide-react';

const RecentActivityPage = () => {
  const { projects, tasks, logs } = useData();
  const { currentUser } = useAuth();

  const myTasks = useMemo(() => {
    return tasks.filter(t => 
      String(t.assignee) === String(currentUser?.id) || 
      `u${t.assignee}` === currentUser?.id ||
      t.assignee === currentUser?.name
    );
  }, [tasks, currentUser]);

  const recentActivities = useMemo(() => {
    const activities = [];

    myTasks.forEach(task => {
      const project = projects.find(p => p.id === task.projectId);
      if (project) {
        activities.push({
          type: 'task',
          description: `Task "${task.title}" is ${task.status}`,
          projectName: project.name,
          timestamp: task.dueDate || 'Recent',
          dateObj: new Date(task.dueDate || new Date())
        });
      }
    });

    logs.forEach(log => {
      if (String(log.submittedBy) === String(currentUser?.id) || `u${log.submittedBy}` === currentUser?.id) {
        const project = projects.find(p => p.id === log.projectId);
        if (project) {
          activities.push({
            type: 'log',
            description: `You submitted a progress log`,
            projectName: project.name,
            timestamp: log.date,
            dateObj: new Date(log.date)
          });
        }
      }
    });

    return activities.sort((a, b) => b.dateObj - a.dateObj);
  }, [myTasks, logs, projects, currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            Recent Activity
          </h1>
          <p className="text-slate-500 mt-1">A timeline of your latest updates and notifications.</p>
        </div>
      </div>
      
      <div className="max-w-4xl">
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default RecentActivityPage;
