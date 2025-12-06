import React, { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input before making API call
      if (!username.trim() || !password.trim()) {
        setError(t('loginForm.errorEmpty'));
        setIsLoading(false);
        return;
      }

      // Attempt login directly - CSRF token will be handled by apiClient
      const success = await login(username, password);
      if (success) {
        navigate('/landing');
      } else {
        setError(t('loginForm.errorInvalid'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || t('loginForm.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-8 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 relative overflow-hidden font-['Fira_Sans',system-ui,sans-serif]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-7 border border-white/20 transform transition-all hover:scale-[1.01]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-3 shadow-lg">
                <span className="text-2xl">🎓</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 tracking-wide">
                {t('loginForm.title')}
              </h1>
              <p className="text-white/70 text-xs sm:text-sm">
                {t('loginForm.subtitle')}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide"
                value={t('loginForm.usernameLabel')}
              />
              <TextInput
                id="username"
                type="text"
                placeholder={t('loginForm.usernamePlaceholder')}
                required
                onChange={(e) => setUsername(e.target.value)}
                sizing="lg"
                autoComplete="username"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-[0.95rem]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide"
                value={t('loginForm.passwordLabel')}
              />
              <TextInput
                id="password"
                type="password"
                placeholder={t('loginForm.passwordPlaceholder')}
                required
                onChange={(e) => setPassword(e.target.value)}
                sizing="lg"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-[0.95rem]"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg" role="alert" aria-live="assertive">
                <p className="text-red-200 text-xs sm:text-sm font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 text-[0.95rem] tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? t('loginForm.submitPending') : t('loginForm.submitIdle')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
