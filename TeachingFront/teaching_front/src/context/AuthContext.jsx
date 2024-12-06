import React, { createContext, useState, useContext, useCallback } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInProgress, setCheckInProgress] = useState(false);

  const checkAuth = useCallback(async () => {
    if (checkInProgress) {
      console.log('Auth check already in progress, skipping...');
      return;
    }

    try {
      setCheckInProgress(true);
      console.log('Starting auth check...');
      
      const response = await apiClient.get('/users/check-auth/');
      console.log('Auth check response status:', response.status);
      
      if (response.status === 200) {
        console.log('Auth check successful:', response.data);
        setUser(response.data);
        setIsAuthenticated(true);
        return true;
      } else {
        console.log('Auth check failed with status:', response.status);
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
      setCheckInProgress(false);
    }
  }, []);

  // Only check auth once when the provider mounts
  React.useEffect(() => {
    console.log('AuthProvider mounted, checking auth...');
    checkAuth();
  }, [checkAuth]);

  const value = {
    isAuthenticated,
    user,
    checkAuth,
    setIsAuthenticated,
    setUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
