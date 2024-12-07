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
      const response = await apiClient.get('/users/me/');
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
      console.error('Auth check error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      setCheckInProgress(false);
    }
    return false;
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      // First, make the login request
      const loginResponse = await apiClient.post('/users/login/', {
        username,
        password
      });
      
      if (loginResponse.status === 200) {
        // If login successful, get user info
        try {
          const userResponse = await apiClient.get('/users/me/');
          if (userResponse.status === 200 && userResponse.data) {
            setUser(userResponse.data);
            setIsAuthenticated(true);
            return true;
          }
        } catch (userError) {
          console.error('Failed to fetch user data after login:', userError);
          throw userError;
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/users/logout/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear the auth state, even if the logout request fails
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Only check auth once when the provider mounts
  React.useEffect(() => {
    console.log('AuthProvider mounted, checking auth...');
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
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
