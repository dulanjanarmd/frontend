import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateProjectButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/portal/projects')}
      className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-bold"
    >
      <Plus className="w-5 h-5 mr-2" />
      Create New Project
    </button>
  );
};

export default CreateProjectButton;
