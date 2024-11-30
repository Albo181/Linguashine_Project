import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {

    //Starts window at top
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    
  const navigate = useNavigate();
  
  const [profilePicture, setProfilePicture] = useState(null); // Separate state for the picture file
  const [profilePicturePreview, setProfilePicturePreview] = useState(''); // Preview URL for display
  const [errorMessage, setErrorMessage] = useState('');
  const [studentData, setStudentData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telephone: '',
    bio: '',
    user_type: 'STUDENT',
  });
  
  const getCsrfToken = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith('csrftoken=')) {
        return cookie.substring('csrftoken='.length);
      }
    }
    return null;
  };



    useEffect(() => {
      const fetchProfile = async () => {
        const csrfToken = getCsrfToken();
        const response = await fetch('/users/profile/', {  //fetch profile data from backend **on opening page
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          
          setStudentData(data);                         // setters for general data and picture data
          
          if (data.profile_picture) {
            setProfilePicturePreview(data.profile_picture);
          }
        } else {
          console.error("Failed to fetch profile data:", response.status);
        }
      };

      fetchProfile();                                   // ensures render happens prior to data population
    }, []);



  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file); // Separate state for file itself
    if (file) {
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setProfilePicturePreview('');
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
      setErrorMessage("Session expired. Please log in again.");
      navigate('/login');
      return;
    }

    const formData = new FormData();                                // if token exists, assign data to our model fields
    formData.append('first_name', studentData.first_name);
    formData.append('last_name', studentData.last_name);
    formData.append('email', studentData.email);
    formData.append('telephone', studentData.telephone);
    formData.append('bio', studentData.bio);

    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      const response = await fetch('/users/profile/', {
        method: 'PATCH',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStudentData({
          ...data,
          profile_picture: data.profile_picture || '',
        });
        setProfilePicturePreview(data.profile_picture || '');
        console.log("Profile updated successfully.");
        setErrorMessage("Profile updated")
      } else {
        console.error("Error updating profile:", response.status);
        setErrorMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };




  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10 mt-16">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center mb-4">
          {profilePicturePreview ? (
            <img
              src={profilePicturePreview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <h2 className="mt-2 text-xl font-semibold">
            {studentData.first_name} {studentData.last_name}
          </h2>
          <p className="text-gray-500 text-sm">{studentData.user_type}</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">               
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <div>
            <label htmlFor="first_name">Nombre</label>
            <input
              id="first_name"
              value={studentData.first_name}
              onChange={(e) => setStudentData({ ...studentData, first_name: e.target.value })}
              placeholder="Introduce tu nombre"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="last_name">Apellidos</label>
            <input
              id="last_name"
              value={studentData.last_name}
              onChange={(e) => setStudentData({ ...studentData, last_name: e.target.value })}
              placeholder="Introduce tus apellidos"
              className="w-full p-2 border rounded-md"
            />  
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={studentData.email}
              onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
              placeholder="Introduce tu correo electrónico"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="telephone">Teléfono</label>
            <input
              id="telephone"
              value={studentData.telephone}
              onChange={(e) => setStudentData({ ...studentData, telephone: e.target.value })}
              placeholder="Introduce tu teléfono"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="bio">Biografía</label>
            <textarea
              id="bio"
              rows={5}
              value={studentData.bio}
              onChange={(e) => setStudentData({ ...studentData, bio: e.target.value })}
              placeholder="Introduce tu biografía"
              className="h-40 w-full border border-gray-lighter text-sm text-gray-darker my-2 rounded-lg"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Update Profile
          </button>
        </form>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default StudentProfile;
