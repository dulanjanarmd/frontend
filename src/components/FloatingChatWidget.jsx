import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Send, MessageCircle, X, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const FloatingChatWidget = () => {
  const { projects, getGlobalMessages, sendGlobalMessage } = useData();
  const { currentUser } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // If user is admin, maybe no projects, or we don't show it?
  if (currentUser?.role === 'admin') return null;

  // Filter projects if needed, or assume all in `projects` are assigned
  // Here we use all projects available to the user.
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  const fetchMessages = async () => {
    if (!selectedProjectId) return;
    const rawId = String(selectedProjectId).replace('p', '');
    const data = await getGlobalMessages(rawId);
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && selectedProjectId) {
      setLoading(true);
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, selectedProjectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProjectId) return;

    const rawId = String(selectedProjectId).replace('p', '');
    const savedMsg = await sendGlobalMessage(rawId, newMessage);
    if (savedMsg) {
      setMessages([...messages, { ...savedMsg, sender: currentUser }]);
      setNewMessage('');
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform ${isOpen ? 'scale-0' : 'scale-100 hover:scale-110'} z-50`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200"
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold">Project Chat</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-indigo-500 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Selector */}
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
              <select
                className="w-full text-sm rounded-md border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white py-1.5"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="" disabled>Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {!selectedProjectId ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">Select a project to start chatting</p>
                </div>
              ) : loading ? (
                <p className="text-center text-slate-400 text-sm mt-4">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-slate-400 text-sm mt-4 italic">No messages yet. Start the conversation!</p>
              ) : (
                messages.map(msg => {
                  const isMe = String(msg.sender?.id) === String(currentUser.id);
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        {!isMe && <span className="text-xs font-semibold text-slate-700">{msg.sender?.name}</span>}
                        <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                        isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
                      }`}>
                        {msg.messageText}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <input
                  type="text"
                  className="flex-1 rounded-full border border-slate-300 pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={!selectedProjectId}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || !selectedProjectId}
                  className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-full w-8 flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 mr-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatWidget;
