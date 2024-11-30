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
  const navigate = useNavigate(); 

  // Get user data from backend (with CSRF token)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/users/me/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),  
          },
          credentials: 'include', // Include session cookies
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Set user data from the backend
          setReceiveNotifications(userData.receive_email_notifications); // Set checkbox based on user data
        } else if (response.status === 401) {
          // If the user is not authenticated, redirect to login
          navigate('/login');
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    fetchUserData();
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-32 pb-32">
      <header className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Welcome Back, {user.first_name}!</h1>
        <p className="text-lg text-gray-500 mt-2">Here's your personalized dashboard.</p>
        <div className="flex items-center justify-center">
          <img
            src={`http://127.0.0.1:8000${user.profile_picture}`}
            alt={`${user.first_name}'s profile picture`}
            className="w-1/6 rounded-full mt-6 border-2 border-blue-400 shadow-custom"
          />
        </div>
      </header>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Profile</h2>
          <p className="text-gray-600 mt-2">Usuario: {user.username}</p>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Nombre: {user.first_name}</p>
          <p className="text-gray-600">Apellidos: {user.last_name}</p>
          <p className="text-gray-600">Teléfono: {user.telephone}</p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Full Profile
          </button>

          <div className="mt-4">
            <label className="text-gray-700">
              <input
                type="checkbox"
                checked={receiveNotifications}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Receive email notifications
            </label>
          </div>
        </div>

        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Quick Links</h2>
          <ul className="mt-4 space-y-2">
            <li><Link to="/feedback" className="text-blue-500 hover:underline">Assignment upload</Link></li>
            <li>
              <Link
                to={user.user_type === 'student' ? '/student-homework' : '/teacher-homework'}
                className="text-blue-500 hover:underline"
              >
                Assignment feedback / history
              </Link>
            </li>
            <li><Link to="/grade-summary-page" className="text-blue-500 hover:underline">View Grades</Link></li>
          </ul>

          <div>
            <button
              onClick={() => navigate('/dash/files')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              My Dashboard
            </button>
          </div>

          <div>
            <button
              onClick={() => navigate('/dash-shared/files')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Shared Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
