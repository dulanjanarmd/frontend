import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, ArrowRight, User, Phone, Mail, Building2, UploadCloud, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Consultations = () => {
  const { consultations, updateConsultation, addProject } = useData();
  const navigate = useNavigate();
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [proposalUrl, setProposalUrl] = useState('');

  const handleUpdateStatus = (id, newStatus) => {
    updateConsultation(id, { status: newStatus });
  };

  const handleAttachProposal = (e) => {
    e.preventDefault();
    if (!proposalUrl) return;
    updateConsultation(selectedConsultation.id, { 
      proposalUrl, 
      status: 'Proposal Sent' 
    });
    setSelectedConsultation({ ...selectedConsultation, proposalUrl, status: 'Proposal Sent' });
    setProposalUrl('');
  };

  const handleConvertToProject = (consultation) => {
    // Generate new project from consultation details
    addProject({
      name: consultation.clientName + ' - ' + consultation.service,
      client: consultation.clientName,
      location: 'TBD', // Would be gathered during consultation
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 15552000000).toISOString().split('T')[0], // 6 months later approx
      description: consultation.description,
      status: 'Planning',
      progress: 0,
      milestones: []
    });
    
    // Mark consultation as converted
    updateConsultation(consultation.id, { status: 'Converted' });
    setSelectedConsultation(null);
    
    // Navigate to projects
    navigate('/portal/projects');
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Consultations & Inquiries
          </h1>
          <p className="text-slate-500 mt-1">Manage public inquiries, proposals, and convert them to projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {/* Kanban Board Columns */}
        {['New Inquiry', 'Proposal Sent', 'Accepted', 'Converted'].map(status => {
          const colConsultations = consultations.filter(c => c.status === status);
          return (
            <div key={status} className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-4 min-h-[60vh] border border-border">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">{status}</h3>
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-1 rounded-full font-bold">
                  {colConsultations.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {colConsultations.map(c => (
                  <motion.div 
                    layoutId={c.id}
                    key={c.id}
                    onClick={() => setSelectedConsultation(c)}
                    className="glass-card p-4 cursor-pointer hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        {c.service}
                      </span>
                      <span className="text-xs text-slate-500">{new Date(c.dateSubmitted).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{c.clientName}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>
                    
                    {c.proposalUrl && (
                      <div className="mt-3 pt-3 border-t border-border flex items-center text-xs text-slate-500">
                        <FileText className="w-3 h-3 mr-1" /> Proposal Attached
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedConsultation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-border w-full max-w-2xl p-6 relative rounded shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedConsultation(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedConsultation.clientName}</h2>
                  <p className="text-sm text-slate-500 font-semibold">{selectedConsultation.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded border border-border">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" /> {selectedConsultation.email}
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" /> {selectedConsultation.phone}
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 mr-2 text-slate-400" /> Web Lead
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-slate-400" /> Status: <span className="font-bold ml-1">{selectedConsultation.status}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Inquiry Details</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{selectedConsultation.description}</p>
              </div>

              {selectedConsultation.proposalUrl && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Proposal Document</p>
                      <a href={selectedConsultation.proposalUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{selectedConsultation.proposalUrl}</a>
                    </div>
                  </div>
                </div>
              )}

              {selectedConsultation.status === 'New Inquiry' && (
                <form onSubmit={handleAttachProposal} className="mb-6 border-t border-border pt-6">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Attach Proposal & Budget</h4>
                  <div className="flex space-x-2">
                    <input 
                      required type="url" 
                      placeholder="Google Drive link or PDF URL" 
                      className="flex-1 rounded border border-input bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                      value={proposalUrl}
                      onChange={e => setProposalUrl(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-bold hover:bg-slate-700 transition-colors flex items-center">
                      <UploadCloud className="w-4 h-4 mr-2" /> Attach & Send
                    </button>
                  </div>
                </form>
              )}

              {selectedConsultation.status === 'Proposal Sent' && (
                <div className="mb-6 border-t border-border pt-6 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-medium">Has the client accepted the proposal?</p>
                  <button 
                    onClick={() => handleUpdateStatus(selectedConsultation.id, 'Accepted')}
                    className="px-4 py-2 bg-green-500 text-white rounded text-sm font-bold hover:bg-green-600 transition-colors"
                  >
                    Mark as Accepted
                  </button>
                </div>
              )}

              {selectedConsultation.status === 'Accepted' && (
                <div className="mb-6 border border-primary/50 bg-primary/5 p-6 rounded text-center">
                  <h3 className="text-xl font-bold mb-2">Client Accepted!</h3>
                  <p className="text-slate-500 text-sm mb-4">You can now convert this consultation into an active project in the system.</p>
                  <button 
                    onClick={() => handleConvertToProject(selectedConsultation)}
                    className="btn-primary flex items-center justify-center mx-auto"
                  >
                    Convert to Project <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Consultations;
