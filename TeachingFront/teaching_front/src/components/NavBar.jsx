import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ChristmasLights from './ChristmasLights';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span
            className="self-center text-2xl ml-2 sm:ml-12 font-bold whitespace-nowrap bg-clip-text text-transparent drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]"
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff, #d4f2ff, #ffffff)',
              textShadow: '0 0 1px rgba(255, 255, 255, 0.8), 0 0 5px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.3px',
            }}
          >
            Linguashine
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/contacto">
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 border-2 border-grey py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 text-center">
              Contactar
            </button>
          </Link>
          <span className="text-white text-md font-bold">Teléfono: 633 971 070</span>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-white bg-red-500 border-2 border-grey hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button type="button" className="text-white bg-green-700 hover:bg-green-800 border-2 border-grey focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                Acceder
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <ChristmasLights />
      {/* Mobile Menu Dropdown */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-green-950 border-t border-green-800`}>
        <div className="px-4 pt-2 pb-3 space-y-3">
          <Link to="/contacto" className="block">
            <button type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 border-2 border-grey py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 text-center">
              Contactar
            </button>
          </Link>
          <div className="text-white text-md font-bold text-center py-2">Teléfono: 633 971 070</div>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="w-full text-white bg-red-500 border-2 border-grey hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
              Logout
            </button>
          ) : (
            <Link to="/login" className="block">
              <button type="button" className="w-full text-white bg-green-700 hover:bg-green-800 border-2 border-grey focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                Acceder
              </button>
            </Link>
          )}
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
