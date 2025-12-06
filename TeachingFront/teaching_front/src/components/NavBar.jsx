import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ChristmasLights from './ChristmasLights';
import LanguageSelector from './LanguageSelector';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { t } = useTranslation();
  const { isAuthenticated: isLoggedIn, checkAuth } = useAuth();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await apiClient.post('/users/logout/');
      if (response.status === 200) {
        await checkAuth(); // Update auth state after logout
        setShowLogoutPopup(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed w-full z-20 top-0 start-0">
      {/* Modern glassmorphism navbar */}
      <div className="bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span
                className="relative text-2xl sm:text-3xl font-extrabold whitespace-nowrap bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)',
                  letterSpacing: '0.05em',
                }}
              >
                Linguashine
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Phone number with icon */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-white/90 text-sm font-medium">{t('navbar.phone')}</span>
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Contact Button */}
            <Link to="/contacto">
              <button 
                type="button" 
                className="relative px-6 py-2.5 border border-white/8 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
              >
                {t('navbar.contact')}
              </button>
            </Link>

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
              >
                {t('navbar.logout')}
              </button>
            ) : (
              <Link to="/login">
                <button 
                  type="button" 
                  className="px-6 py-2.5 text-sm font-semibold text-white border border-white/8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105"
                >
                  {t('navbar.login')}
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="relative p-2 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Christmas Lights - kept exactly as is */}
        <ChristmasLights />
      </div>

      {/* Mobile Menu Dropdown with modern styling */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-gradient-to-b from-slate-900/98 to-blue-900/98 backdrop-blur-xl border-b border-white/10 shadow-2xl`}>
        <div className="px-4 pt-4 pb-6 space-y-3">
          {/* Phone number */}
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mb-2">
            <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-white/90 text-base font-semibold">{t('navbar.phone')}</span>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center py-2">
            <LanguageSelector />
          </div>

          {/* Contact Button */}
          <Link to="/contacto" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <button 
              type="button" 
              className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-lg"
            >
              {t('navbar.contact')}
            </button>
          </Link>

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <button 
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }} 
              className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 shadow-lg"
            >
              {t('navbar.logout')}
            </button>
          ) : (
            <Link to="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
              <button 
                type="button" 
                className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 shadow-lg"
              >
                {t('navbar.login')}
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Logout Success Popup - Modern toast notification */}
      {showLogoutPopup && (
        <div className="fixed top-20 right-4 md:right-8 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl border border-green-400/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{t('navbar.logoutSuccess')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add animation for popup */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
