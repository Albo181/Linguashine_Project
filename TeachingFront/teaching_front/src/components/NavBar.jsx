import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/users/check-auth/', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.logged_in);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, [location.pathname]);

  const getCsrfToken = () => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') return value;
    }
    return null;
  };

  const handleLogout = async () => {
    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        alert('CSRF token is missing. Please refresh the page and try again.');
        return;
      }

      const response = await fetch('/users/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.ok) {
        setShowLogoutPopup(true);
        setTimeout(() => {
          setShowLogoutPopup(false);
          setIsLoggedIn(false);
          navigate('/login');
        }, 3000);
      } else {
        console.error('Logout failed:', response.status);
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred while logging out.');
    }
  };

  return (
    <nav className="bg-green-950 fixed w-full z-20 top-0 start-0 border-b-4 border-white-950">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span
            className="self-center text-2xl ml-12 font-bold whitespace-nowrap bg-clip-text text-transparent drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]"
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff, #d4f2ff, #ffffff)',
              textShadow: '0 0 1px rgba(255, 255, 255, 0.8), 0 0 5px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.3px',
            }}
          >
            Linguashine
          </span>
        </a>
        <div className="flex items-center space-x-4 md:order-2">
          <a href="/contacto">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 border-2 border-grey py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Contactar
            </button>
          </a>
          <span className="text-white text-md font-bold">Teléfono: 633 971 070</span>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 border-2 border-grey hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-white bg-green-700 border-2 border-grey hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              Acceder
            </button>
          )}

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>

      {showLogoutPopup && (
        <div className="popup absolute top-16 right-16 p-4 bg-gray-800 text-white rounded-lg">
          You have been logged out successfully!
        </div>
      )}
    </nav>
  );
};

export default NavBar;
