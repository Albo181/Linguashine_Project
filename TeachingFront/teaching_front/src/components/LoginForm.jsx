import React, { useState, useContext } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import apiClient, { fetchCSRFToken } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated, setUser, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First, ensure we have a CSRF token
      await fetchCSRFToken();

      // Now attempt login
      const response = await apiClient.post('/users/login/', {
        username,
        password
      });

      if (response.status === 200) {
        // If login is successful, call the login function from AuthContext
        const success = await login(username, password);
        if (success) {
          navigate('/landing');
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        setError(response.data?.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso estudiantes</h1>
            <p className="text-gray-500 text-sm mb-8">Bienvenido a tu portal de aprendizaje</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700" value="Usuario" />
            <TextInput
              id="username"
              type="text"
              placeholder="Introduzca su usuario"
              required
              onChange={(e) => setUsername(e.target.value)}
              sizing="lg"
              autoComplete="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700" value="Contraseña" />
            <TextInput
              id="password"
              type="password"
              placeholder="Introduzca su contraseña"
              required
              onChange={(e) => setPassword(e.target.value)}
              sizing="lg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg" role="alert" aria-live="assertive">
              <p className="text-red-600 text-sm font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
