import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FileDashboard.css';
import apiClient from '../api/apiClient';

const ProfileImage = ({ src, userName, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Construct the full URL based on whether it's a local or production URL
  const fullImageUrl = src?.startsWith('http') 
    ? src 
    : src ? `${apiClient.defaults.baseURL}${src}` : null;

  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    
    if (!fullImageUrl) {
      setImageError(true);
      setIsLoading(false);
      return;
    }

    console.log('Attempting to load image from:', fullImageUrl);

    // Test image loading
    const img = new Image();
    img.onload = () => {
      console.log('Successfully loaded image:', fullImageUrl);
      setIsLoading(false);
      setImageError(false);
    };
    img.onerror = (e) => {
      console.error('Failed to load image:', fullImageUrl, e);
      setImageError(true);
      setIsLoading(false);
    };
    img.src = fullImageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [fullImageUrl]);

  if (imageError || !fullImageUrl) {
    return (
      <div className={`w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500 border-4 border-white shadow-xl ${className}`}>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={fullImageUrl}
        alt={`${userName}'s profile`}
        className={`w-full h-full rounded-full object-cover border-4 border-white shadow-xl ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className}`}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

const LandingPage = () => {
  console.log('LandingPage component rendering');

  const [user, setUser] = useState(null);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LandingPage useEffect running');
    const fetchData = async () => {
      try {
        console.log('Starting to fetch data');
        setLoading(true);
        setError(null);
        
        const userResponse = await apiClient.get('/users/me/');
        console.log('Raw user response:', userResponse);
        
        if (userResponse.status === 200) {
          const data = userResponse.data;
          console.log('User data received:', data);
          console.log('Profile picture URL:', data.profile_picture_url);
          console.log('Profile picture:', data.profile_picture);
          
          setUser(data);
          setReceiveNotifications(data.receive_email_notifications || false);
          
          // Handle profile picture URL
          if (data.profile_picture_url) {
            // Use the full URL from the backend
            setProfilePicturePreview(data.profile_picture_url);
          } else if (data.profile_picture) {
            // For local development, use the relative path
            setProfilePicturePreview(data.profile_picture);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load user data. Please try again later.');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  console.log('Current state:', { user, profilePicturePreview, loading });

  // Handle checkbox change
  const handleCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setReceiveNotifications(isChecked);

    try {
      const response = await apiClient.post('/users/update-notifications/', {
        receive_email_notifications: isChecked
      });
      
      if (response.status !== 200) {
        console.error('Failed to update notifications preference');
      }
    } catch (error) {
      console.error('Error updating notifications preference:', error);
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-100">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user data available');
    return null;
  }

  console.log('Rendering main component with:', { user, profilePicturePreview });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 pt-28 pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 relative">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-32 h-32 relative z-10">
                <ProfileImage 
                  src={profilePicturePreview} 
                  userName={user?.first_name}
                />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back, {user?.first_name}!
          </h1>
          <p className="text-lg text-gray-500">Here's your personalized dashboard.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-500 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Your Profile</h2>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Usuario:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Nombre:</span>
                <span>{user.first_name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Apellidos:</span>
                <span>{user.last_name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Teléfono:</span>
                <span>{user.telephone}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate('/profile')}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Full Profile
              </button>

              <label className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg group relative">
                <input
                  type="checkbox"
                  checked={receiveNotifications}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-not-allowed opacity-50"
                  disabled
                />
                <span>Receive email notifications</span>
                <div className="hidden group-hover:block absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                  Coming soon! 🚀
                </div>
              </label>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-500 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Quick Links</h2>
            </div>

            <div className="space-y-4 mb-8">
              <ul className="space-y-4">
                <li>
                  <Link to="/dash/files" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <svg className="w-5 h-5 text-blue-500 mr-3 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    My Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dash-shared/files" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <svg className="w-5 h-5 text-blue-500 mr-3 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Shared Files
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <svg className="w-5 h-5 text-blue-500 mr-3 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Assignment upload
                  </Link>
                </li>
                <li>
                  <Link
                    to={user.user_type === 'student' ? '/student-homework' : '/teacher-homework'}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <svg className="w-5 h-5 text-blue-500 mr-3 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Assignment feedback / history
                  </Link>
                </li>
                <li>
                  <Link to="/homework" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <svg className="w-5 h-5 text-blue-500 mr-3 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Homework
                  </Link>
                </li>
                <li>
                  <Link to="/grade-summary-page" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <svg className="w-5 h-5 text-blue-500 mr-3 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Grades
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
