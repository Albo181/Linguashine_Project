import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FileDashboard.css';

// Helper function to retrieve CSRF token from cookies
function getCsrfToken() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith('csrftoken=')) {
          return cookie.substring('csrftoken='.length);
      }
  }
  return null;
}

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [receiveNotifications, setReceiveNotifications] = useState(false); // State for checkbox
  const [upcomingHomework, setUpcomingHomework] = useState([]);
  const navigate = useNavigate(); 

  // Get user data from backend (with CSRF token)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/users/me/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),  
          },
          credentials: 'include', // Include session cookies
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData); // Set user data from the backend
          setReceiveNotifications(userData.receive_email_notifications); // Set checkbox based on user data

          // Fetch upcoming homework
          const homeworkResponse = await fetch('/api/homework/due_soon/', {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCsrfToken(),
            },
            credentials: 'include',
          });

          if (homeworkResponse.ok) {
            const homeworkData = await homeworkResponse.json();
            setUpcomingHomework(homeworkData);
          }
        } else if (userResponse.status === 401) {
          // If the user is not authenticated, redirect to login
          navigate('/login');
        } else {
          console.error('Failed to fetch user data:', userResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    fetchData();
  }, [navigate]);

  // Handle checkbox change
  const handleCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setReceiveNotifications(isChecked);

    // Update the user's notification preference in the backend
    try {
      const response = await fetch('/users/update-notifications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ receive_email_notifications: isChecked }),
      });

      if (!response.ok) {
        console.error('Failed to update notifications preference');
      }
    } catch (error) {
      console.error('Error updating notifications preference:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
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
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-gray-600 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 pt-28 pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 relative">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
              <img
                src={`http://127.0.0.1:8000${user.profile_picture}`}
                alt={`${user.first_name}'s profile picture`}
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl relative z-10"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back, {user.first_name}!
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

              <label className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  checked={receiveNotifications}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span>Receive email notifications</span>
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
                    {upcomingHomework.length > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {upcomingHomework.length}
                      </span>
                    )}
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

            {upcomingHomework.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      You have {upcomingHomework.length} homework {upcomingHomework.length === 1 ? 'assignment' : 'assignments'} due in the next 3 days
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
