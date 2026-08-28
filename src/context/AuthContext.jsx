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
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulated async login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find user by email (ignoring password for this mock)
        const user = users.find(u => u.email === email);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('mockUserId', user.id);
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
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
