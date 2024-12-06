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
      
      // Try to get user info - if successful, we're authenticated
      const response = await apiClient.get('/Users/me/');
      console.log('Auth check response:', response.data);
      
      if (response.status === 200 && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // 401/403 are expected when not logged in
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Not authenticated - this is normal for public pages');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.error('Auth check error:', error);
        // For other errors, maintain current auth state
      }
    } finally {
      setIsLoading(false);
      setCheckInProgress(false);
    }
    return false;
  }, []);

  const login = useCallback(async () => {
    try {
      const response = await apiClient.get('/Users/me/');
      if (response.status === 200 && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('Login check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/Users/logout/');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
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
    isLoading,
    login,
    logout,
    checkAuth
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

export default AuthContext;
