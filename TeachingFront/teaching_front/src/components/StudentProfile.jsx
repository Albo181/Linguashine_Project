import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const ProfileImage = ({ src, userName, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle different types of URLs
  const fullImageUrl = src?.includes('#preview') 
    ? src.replace('#preview', '') // Remove marker and use blob URL directly
    : src?.startsWith('http') 
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

    // Cleanup blob URLs when component unmounts or src changes
    return () => {
      img.onload = null;
      img.onerror = null;
      if (src?.includes('#preview')) {
        URL.revokeObjectURL(fullImageUrl);
      }
    };
  }, [fullImageUrl, src]);

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

const StudentProfile = () => {

  //Starts window at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(null); // Separate state for the picture file
  const [profilePicturePreview, setProfilePicturePreview] = useState(''); // Preview URL for display
  const [errorMessage, setErrorMessage] = useState('');
  const [imageLoadRetries, setImageLoadRetries] = useState(0);  // Add retry counter
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/me/');
        
        if (response.status === 200) {
          const data = response.data;
          
          // Handle profile picture
          if (data.profile_picture_url) {
            setProfilePicturePreview(data.profile_picture_url);
          } else if (data.profile_picture) {
            setProfilePicturePreview(data.profile_picture);
          }

          // Parse bio data
          try {
            const bioData = JSON.parse(data.bio || '{"goals":[],"notes":""}');
            setGoals(bioData.goals || []);
            // Set student data without the raw bio JSON
            setStudentData(prev => ({
              ...prev,
              ...data,
              bio: bioData.notes || ''  // Only set the notes part to bio
            }));
          } catch (error) {
            // If parsing fails, initialize with empty values
            setGoals([]);
            setStudentData(prev => ({
              ...prev,
              ...data,
              bio: ''
            }));
          }
        } else {
          setErrorMessage("Failed to fetch profile data");
        }
      } catch (error) {
        setErrorMessage('Error loading profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be less than 5MB');
        return;
      }
      console.log('Selected file:', file);  
      setProfilePicture(file); 
      
      // Create a blob URL for preview and mark it as a blob URL
      const blobUrl = URL.createObjectURL(file);
      console.log('Created blob URL for preview:', blobUrl);
      setProfilePicturePreview(blobUrl + '#preview');  // Add marker to identify preview URLs
      setErrorMessage('');
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
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      
      // Append all student data fields except profile picture related fields
      Object.keys(studentData).forEach(key => {
        if (!['profile_picture', 'profile_picture_url'].includes(key)) {
          formData.append(key, studentData[key]);
        }
      });
      
      // Append profile picture if changed
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      
      // Append goals and notes separately
      const bioData = JSON.stringify({
        goals: goals,
        notes: studentData.bio || ''  // Ensure we have a string value
      });
      formData.append('bio', bioData);

      console.log('Submitting form data:', {
        ...Object.fromEntries(formData.entries()),
        profile_picture: profilePicture ? profilePicture.name : 'no new picture'
      });

      const response = await apiClient.put('/users/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        const data = response.data;
        
        // Handle profile picture update
        if (data.profile_picture) {
          const newPictureUrl = data.profile_picture.startsWith('http') 
            ? data.profile_picture 
            : `${apiClient.defaults.baseURL}${data.profile_picture}`;
            
          const img = new Image();
          img.onload = () => {
            setProfilePicturePreview(newPictureUrl);
            setProfilePicture(null);
          };
          img.onerror = () => {
            setProfilePicturePreview(oldPreview);
          };
          img.src = newPictureUrl;
        }

        // Parse and set goals and notes separately
        try {
          const parsedBioData = JSON.parse(data.bio);
          setGoals(parsedBioData.goals || []);
          setStudentData(prev => ({
            ...prev,
            ...data,
            bio: parsedBioData.notes || ''  // Set only the notes part to bio
          }));
        } catch (error) {
          // If parsing fails, keep existing goals and set bio as is
          setStudentData(prev => ({
            ...prev,
            ...data
          }));
        }
        
        setErrorMessage("Profile updated successfully");
      } else {
        console.error("Error updating profile:", response.status);
        setErrorMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error updating profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 mt-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 relative z-10">
                <ProfileImage
                  src={profilePicturePreview}
                  userName={studentData.first_name}
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer transform transition-transform hover:scale-110 z-20">
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
                    Este espacio es personal - solo tú puedes verlo. Utilízalo para tus notas adicionales y reflexiones.
                  </span>
                </label>
                <textarea
                  id="bio"
                  value={studentData.bio}
                  onChange={(e) => setStudentData({ ...studentData, bio: e.target.value })}
                  placeholder="Escribe aquí tus notas personales..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Guardar cambios
              </button>

              {/* Success/Error Message moved below the button */}
              {errorMessage && (
                <div 
                  className={`w-full p-3 rounded-lg text-sm text-center ${
                    errorMessage === "Profile updated successfully" 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {errorMessage}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
