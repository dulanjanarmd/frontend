import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import MilestoneFormList from './MilestoneFormList';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';

const CreateProjectForm = () => {
  const { addProject, users } = useData();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'PLANNING',
    progressPercentage: 0
  });
  
  const [milestones, setMilestones] = useState([]);

  // Filter clients
  const clients = users.filter(u => u.role === 'client');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (formData.name.length < 3) {
      setError('Project name must be at least 3 characters long.');
      return;
    }
    if (!formData.clientId) {
      setError('Please select a client.');
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('Expected End Date must be after Start Date.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build project payload
      const projectPayload = {
        name: formData.name,
        client: { id: parseInt(formData.clientId.replace('u', ''), 10) },
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        status: formData.status,
        progressPercentage: Number(formData.progressPercentage),
        milestones: milestones.length > 0 ? milestones : undefined
      };

      await addProject(projectPayload);
      
      // Navigate back to overview on success
      navigate('/portal');
    } catch (err) {
      setError(err.message || 'An error occurred while creating the project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/portal')}
          className="mr-4 p-2 text-slate-500 hover:bg-slate-200 :bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600   bg-clip-text text-transparent">
            Create New Project
          </h1>
          <p className="text-slate-500 mt-1">Set up a new project after proposal acceptance.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50  text-red-600  p-4 rounded-lg border border-red-200  mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form id="createProjectForm" onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold border-b border-border pb-3">Project Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Horizon Residencies - Phase 1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client <span className="text-red-500">*</span></label>
                  <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                    <option value="" disabled>Select a registered client</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Nugegoda, Colombo" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input required type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected End Date <span className="text-red-500">*</span></label>
                  <input required type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows="4" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief scope and details of the project..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Status <span className="text-red-500">*</span></label>
                  <select required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Progress (%)</label>
                  <input type="number" min="0" max="100" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.progressPercentage} onChange={e => setFormData({...formData, progressPercentage: e.target.value})} />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <MilestoneFormList milestones={milestones} setMilestones={setMilestones} />
          </div>
          
          <div className="glass-card p-6 flex flex-col items-center justify-center bg-slate-50 ">
             <button 
              type="submit" 
              form="createProjectForm"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Project...
                </>
              ) : (
                'Create Project'
              )}
            </button>
            <p className="text-xs text-slate-500 mt-3 text-center">
              By creating, you acknowledge the project proposal has been formally accepted by the client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectForm;
