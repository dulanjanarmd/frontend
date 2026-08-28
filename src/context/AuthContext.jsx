import React, { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching session from local storage
    const storedUserId = localStorage.getItem('mockUserId');
    if (storedUserId) {
      const user = users.find(u => u.id === storedUserId);
      if (user) setCurrentUser(user);
    } else {
      // Default to CEO for demo purposes if not logged in
      setCurrentUser(users[0]);
    }
    setLoading(false);
  }, []);

  const login = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('mockUserId', user.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mockUserId');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
