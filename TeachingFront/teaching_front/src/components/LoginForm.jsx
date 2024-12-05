import React, { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

// Helper function to get CSRF token from cookies
function getCsrfToken() {    //run in users browser, retrieves from browsers cookie (no need to fetch from backend again)
    const cookies = document.cookie.split(';');  
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.substring('csrftoken='.length);
        }
    }
    return null;
}

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    //POST SUBMIT to backend
    const handleSubmit = async (event) => {
      event.preventDefault();
    
      try {
        const loginResponse = await fetch('/users/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include',
        });
    
        //If details match, GET request for userData from backend endpoint 
        if (loginResponse.ok) {
          // Login successful, fetch user data
          const userResponse = await fetch('/users/me/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCsrfToken(),
            },
            credentials: 'include',
          });
    
          //If data correctly received, store it as userData and navigate to 'landing'
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('User Data:', userData); // Use this data as needed
            navigate('/landing');
          } else {
            console.error('Failed to fetch user data');
          }
        } else {
          setErrorMessage('Invalid username or password');
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again later.');
        console.error('Login error:', error);
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
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg"
          >
            <span className="flex items-center justify-center">
              Iniciar sesión
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Button>

          {errorMessage && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg" role="alert" aria-live="assertive">
              <p className="text-red-600 text-sm font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {errorMessage}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
