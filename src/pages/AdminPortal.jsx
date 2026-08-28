import React, { useState } from 'react';
import { users as initialUsers } from '../utils/mockData';
import { UserPlus, Shield, Mail, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPortal = () => {
  const [usersList, setUsersList] = useState(initialUsers);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          System Administration
        </h1>
        <button 
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="font-bold text-lg">Manage Users & Roles</h2>
          <p className="text-sm text-slate-500">Configure access control for the platform.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usersList.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user.id} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-2 text-slate-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center w-fit capitalize">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
