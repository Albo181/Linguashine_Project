import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await fetch('https://linguashineproject-production.up.railway.app/users/check-auth/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.log('Not authenticated');
    }
    setIsAuthenticated(false);
    setUser(null);
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, checkAuth, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
