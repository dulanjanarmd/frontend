import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Camera, Plus, X, UploadCloud, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Logs = () => {
  const { logs, addLog, projects } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    weather: 'Sunny',
    manpower: '',
    workDone: '',
    percentageCompleted: '',
    issues: '',
    photos: [] // Array of { url, caption }
  });

  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '', uploading: false });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewPhoto(prev => ({ ...prev, uploading: true }));
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: uploadData
      });
      if (res.ok) {
        const data = await res.json();
        setNewPhoto(prev => ({ ...prev, url: data.fullUrl, uploading: false }));
      } else {
        alert('Upload failed');
        setNewPhoto(prev => ({ ...prev, uploading: false }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      setNewPhoto(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default mock photo if none provided
    const finalPhotos = formData.photos.length > 0 ? formData.photos : [{
      url: 'https://images.unsplash.com/photo-1541888081622-6323c21c7e92?q=80&w=2070&auto=format&fit=crop',
      caption: 'General site overview'
    }];
    
    addLog({
      ...formData,
      submittedBy: currentUser.id,
      photos: finalPhotos
    });
    setIsModalOpen(false);
    setFormData({ projectId: '', date: new Date().toISOString().split('T')[0], weather: 'Sunny', manpower: '', workDone: '', percentageCompleted: '', issues: '', photos: [] });
  };

  const addPhoto = () => {
    if (newPhoto.url) {
      setFormData({ ...formData, photos: [...formData.photos, newPhoto] });
      setNewPhoto({ url: '', caption: '' });
    }
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const isSiteEngineer = currentUser?.role === 'site_engineer';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
            Site Progress Logs
          </h1>
          <p className="text-slate-500 mt-1">Daily field capture and issue reporting.</p>
        </div>
        {isSiteEngineer && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Submit Daily Log
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {logs.map(log => {
          const project = projects.find(p => String(p.id) === String(log.projectId).replace('p', ''));
          // If old mock data format (array of strings), convert to object
          const safePhotos = log.photos || [];
          const formattedPhotos = safePhotos.length > 0 && typeof safePhotos[0] === 'string'
            ? safePhotos.map(p => ({ url: p, caption: 'Progress photo' }))
            : safePhotos;

          return (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 flex flex-col xl:flex-row gap-8"
            >
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 ">{project?.name || 'Unknown Project'}</h3>
                    <p className="text-sm text-slate-500 font-medium">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/20 text-primary  rounded text-sm font-bold border border-primary/30">
                    +{log.percentageCompleted}% Completed
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Weather</p>
                    <p className="font-medium text-slate-800 ">{log.weather}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Manpower</p>
                    <p className="font-medium text-slate-800 ">{log.manpower} Workers</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Submitted By</p>
                     <p className="font-medium text-slate-800  capitalize">{typeof log.submittedBy === 'string' && log.submittedBy.includes('_') ? log.submittedBy.replace(/_/g, ' ') : (log.siteEngineer?.name || String(log.submittedBy || 'Unknown'))}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900  mb-2 uppercase tracking-wider">Work Done</h4>
                  <p className="text-slate-600  text-sm leading-relaxed">{log.workDone}</p>
                </div>

                {log.issues && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-4 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-700  mb-1 uppercase tracking-wider">Reported Issue</h4>
                      <p className="text-sm text-red-600 ">{log.issues}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photos Gallery */}
              <div className="w-full xl:w-1/3 flex-shrink-0 space-y-4">
                <h4 className="text-sm font-bold text-slate-900  uppercase tracking-wider flex items-center">
                  <Camera className="w-4 h-4 mr-2" /> Field Captures ({formattedPhotos.length})
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {formattedPhotos.map((photo, i) => (
                    <div key={i} className="group relative rounded overflow-hidden border border-border bg-slate-100 ">
                      <div className="aspect-video">
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/90 to-transparent p-3 pt-8">
                        <p className="text-white text-sm font-medium flex items-center">
                          <MessageSquare className="w-3 h-3 mr-2 text-primary" />
                          {photo.caption || 'Site progress photo'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          );
        })}
        {logs.length === 0 && (
          <div className="glass-card p-12 text-center text-slate-500">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No progress logs submitted yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white  border border-border w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto rounded shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 :text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-900  mb-6">Submit Daily Progress Log</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700  mb-1">Project</label>
                    <select required className="w-full rounded border border-input bg-slate-50  px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                      <option value="" disabled>Select a project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700  mb-1">Date</label>
                    <input required type="date" className="w-full rounded border border-input bg-slate-50  px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700  mb-1">Weather</label>
                    <select required className="w-full rounded border border-input bg-slate-50  px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.weather} onChange={e => setFormData({...formData, weather: e.target.value})}>
                      <option>Sunny</option>
                      <option>Cloudy</option>
                      <option>Rainy</option>
                      <option>Storm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700  mb-1">Manpower</label>
                    <input required type="number" min="0" placeholder="e.g. 15" className="w-full rounded border border-input bg-slate-50  px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.manpower} onChange={e => setFormData({...formData, manpower: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700  mb-1">% Completed Today</label>
                    <input required type="number" min="0" max="100" placeholder="e.g. 2" className="w-full rounded border border-input bg-slate-50  px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={formData.percentageCompleted} onChange={e => setFormData({...formData, percentageCompleted: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700  mb-1">Work Done</label>
                  <textarea required rows="3" placeholder="Describe the work completed today..." className="w-full rounded border border-input bg-slate-50  px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.workDone} onChange={e => setFormData({...formData, workDone: e.target.value})}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-red-600  mb-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Report Issues or Observations (Optional)
                  </label>
                  <textarea rows="2" placeholder="Report any delays, material shortages, safety concerns..." className="w-full rounded border border-red-200  bg-red-50  px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none" value={formData.issues} onChange={e => setFormData({...formData, issues: e.target.value})}></textarea>
                </div>

                <div className="border-t border-border pt-4">
                  <label className="block text-sm font-bold text-slate-700  mb-2">Progress Photos & Captions</label>
                  
                  {formData.photos.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {formData.photos.map((p, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-slate-50  p-2 rounded border border-border">
                          <img src={p.url} alt={p.caption} className="w-12 h-12 object-cover rounded" />
                          <p className="flex-1 text-sm truncate">{p.caption}</p>
                          <button type="button" onClick={() => removePhoto(idx)} className="p-1 text-red-500 hover:bg-red-100 :bg-red-900/30 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={newPhoto.uploading}
                      className="flex-1 rounded border border-input bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" 
                    />
                    {newPhoto.uploading && <span className="text-xs text-slate-500">Uploading...</span>}
                    {newPhoto.url && (
                      <span className="text-xs text-green-600 truncate w-24">✓ Uploaded</span>
                    )}
                    <input 
                      type="text" 
                      placeholder="Caption (e.g. Ground leveling)" 
                      className="flex-1 rounded border border-input bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" 
                      value={newPhoto.caption} 
                      onChange={e => setNewPhoto({...newPhoto, caption: e.target.value})} 
                    />
                    <button 
                      type="button" 
                      onClick={addPhoto} 
                      disabled={!newPhoto.url || newPhoto.uploading} 
                      className="px-4 py-2 bg-slate-200 text-slate-800 rounded font-medium disabled:opacity-50 hover:bg-slate-300 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3 border-t border-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600  hover:bg-slate-100 :bg-slate-800 rounded transition-colors">Cancel</button>
                  <button type="submit" className="btn-primary">Submit Daily Log</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Logs;
