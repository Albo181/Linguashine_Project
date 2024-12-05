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
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [studentData, setStudentData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telephone: '',
    bio: '',
    user_type: 'STUDENT',
  });

  const MAX_GOALS = 50; // Maximum number of goals allowed

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

        // Parse goals from bio if they exist
        try {
          const bioData = JSON.parse(data.bio);
          if (bioData.goals && Array.isArray(bioData.goals)) {
            setGoals(bioData.goals);
          }
          if (bioData.notes) {
            setStudentData(prev => ({ ...prev, bio: bioData.notes }));
          }
        } catch {
          // If bio isn't JSON, treat it all as notes
          setStudentData(data);
        }

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

  const handleAddGoal = (e) => {
    e?.preventDefault();
    if (newGoal.trim()) {
      if (goals.length >= MAX_GOALS) {
        setErrorMessage(`No puedes añadir más de ${MAX_GOALS} objetivos. Considera completar o eliminar algunos primero.`);
        return;
      }
      setGoals([...goals, { text: newGoal.trim(), completed: false }]);
      setNewGoal('');
      setErrorMessage('');
    }
  };

  const toggleGoal = (index) => {
    const newGoals = [...goals];
    newGoals[index].completed = !newGoals[index].completed;
    setGoals(newGoals);
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
      setErrorMessage("Session expired. Please log in again.");
      navigate('/login');
      return;
    }

    // Combine goals and notes into bio field
    const bioData = JSON.stringify({
      goals: goals,
      notes: studentData.bio
    });

    const formData = new FormData();                                // if token exists, assign data to our model fields
    formData.append('first_name', studentData.first_name);
    formData.append('last_name', studentData.last_name);
    formData.append('email', studentData.email);
    formData.append('telephone', studentData.telephone);
    formData.append('bio', bioData);

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
        
        // Parse the bio field if it's JSON
        try {
          const bioData = JSON.parse(data.bio);
          setGoals(bioData.goals || []);
          setStudentData({
            ...data,
            bio: bioData.notes || ''
          });
        } catch {
          // If parsing fails, treat everything as notes
          setStudentData(data);
          setGoals([]);
        }

        if (data.profile_picture) {
          setProfilePicturePreview(data.profile_picture);
        }
        console.log("Profile updated successfully.");
        setErrorMessage("Profile updated");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 mt-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500 border-4 border-white shadow-xl">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer transform transition-transform hover:scale-110">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {studentData.first_name} {studentData.last_name}
            </h2>
            <span className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full mt-2">
              {studentData.user_type}
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              errorMessage === "Profile updated" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="first_name"
                  value={studentData.first_name}
                  onChange={(e) => setStudentData({ ...studentData, first_name: e.target.value })}
                  placeholder="Introduce tu nombre"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos
                </label>
                <input
                  id="last_name"
                  value={studentData.last_name}
                  onChange={(e) => setStudentData({ ...studentData, last_name: e.target.value })}
                  placeholder="Introduce tus apellidos"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-sm text-gray-500">(No editable)</span>
              </label>
              <input
                id="email"
                value={studentData.email}
                readOnly
                disabled
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                id="telephone"
                value={studentData.telephone}
                onChange={(e) => setStudentData({ ...studentData, telephone: e.target.value })}
                placeholder="Introduce tu teléfono"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mis objetivos de aprendizaje
                  <span className="block text-xs text-gray-500 mt-1">
                    Marca las casillas cuando alcances tus objetivos
                  </span>
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal(e)}
                      placeholder="Añadir nuevo objetivo..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={goals.length >= MAX_GOALS}
                    />
                    <button
                      onClick={handleAddGoal}
                      type="button"
                      className={`px-4 py-2 text-white rounded-lg transition-colors ${
                        goals.length >= MAX_GOALS 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                      disabled={goals.length >= MAX_GOALS}
                    >
                      Añadir
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {goals.length > 0 && (
                      <span>{goals.length} de {MAX_GOALS} objetivos añadidos</span>
                    )}
                  </div>
                  <div className="pb-4"></div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto bg-gray-50 p-4 rounded-lg">
                    {goals.length === 0 ? (
                      <p className="text-gray-500 text-center text-sm">No hay objetivos añadidos aún</p>
                    ) : (
                      <>
                        <div className="sticky top-0 bg-gray-50 pb-2 mb-2 border-b border-gray-200">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Completados: {goals.filter(g => g.completed).length}</span>
                            <span>Pendientes: {goals.filter(g => !g.completed).length}</span>
                          </div>
                        </div>
                        {goals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => toggleGoal(index)}
                              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className={`flex-1 ${goal.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {goal.text}
                            </span>
                            <button
                              onClick={() => removeGoal(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Eliminar objetivo"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Mis notas personales
                  <span className="block text-xs text-gray-500 mt-1">
                    Este espacio es personal - solo tú puedes verlo. Utilízalo para tus notas adicionales y recordatorios.
                  </span>
                </label>
                <textarea
                  id="bio"
                  value={studentData.bio}
                  onChange={(e) => setStudentData({ ...studentData, bio: e.target.value })}
                  placeholder="Escribe aquí tus notas personales..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none font-light"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
