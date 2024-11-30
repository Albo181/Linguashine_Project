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
    <div className="flex items-center justify-center h-1/2">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4 mt-40 mb-40">
        <h1 className="font-bold mb-8 text-center">Acceso estudiantes</h1>

        <Label htmlFor="username" value="Usuario" />
        <TextInput
          id="username"
          type="text"
          placeholder="Introduzca su usuario"
          required
          onChange={(e) => setUsername(e.target.value)}
          sizing="lg"
          autoComplete="username"
        />

        <Label htmlFor="password" value="Contraseña" />
        <TextInput
          id="password"
          type="password"
          placeholder="Introduzca su contraseña"
          required
          onChange={(e) => setPassword(e.target.value)}
          sizing="lg"
        />

        <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl">
          Enviar
        </Button>

        {errorMessage && (
          <p className="text-red-500" role="alert" aria-live="assertive">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
