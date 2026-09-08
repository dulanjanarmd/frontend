import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectTable = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-card overflow-hidden flex flex-col mt-6">
      <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-xl font-bold">Projects List</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              className="pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Project Name</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Progress</th>
              <th className="px-6 py-4 font-medium">Start Date</th>
              <th className="px-6 py-4 font-medium">End Date</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProjects.map(project => (
              <tr 
                key={project.id} 
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/portal/projects/${project.id}`)}
              >
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{project.name}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{project.client}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full w-fit whitespace-nowrap ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                    project.status === 'Planning' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{project.startDate}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{project.endDate}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/portal/projects/${project.id}`);
                    }}
                    className="text-primary hover:text-blue-600 font-medium text-sm transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                  No projects found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
