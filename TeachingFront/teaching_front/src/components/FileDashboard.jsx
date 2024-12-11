import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import FileCard from './FileCard';
import FileFilterPanel from './FileFilterPanel';
import './FileDashboard.css';

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

const FileDashboard = () => {
  // Starts window at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State declarations
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', searchTerm: '' });
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('document');
  const [title, setTitle] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch CSRF token
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

  // Fetch files
  const fetchFiles = async () => {
    if (!selectedStudentId) return;
    try {
      const endpoint = `/files/private/all-files/${selectedStudentId}/`;
      const response = await apiClient.get(endpoint);
      console.log('Raw file data:', response.data);

      const constructFileUrl = (file) => {
        return file.file_url || // Use file_url if provided
          (file.file?.startsWith('http') ? file.file : // Use file if it's a full URL
          `${apiClient.defaults.baseURL}${file.file}`); // Construct URL for relative paths
      };

      const allFiles = [
        ...(response.data.private_documents?.map((file) => ({ 
          ...file, 
          type: 'document',
          file_url: constructFileUrl(file)
        })) || []),
        ...(response.data.private_images?.map((file) => ({ 
          ...file, 
          type: 'image',
          file_url: constructFileUrl(file)
        })) || []),
        ...(response.data.private_audio?.map((file) => ({ 
          ...file, 
          type: 'audio',
          file_url: constructFileUrl(file)
        })) || []),
        ...(response.data.private_videos?.map((file) => ({ 
          ...file, 
          type: 'video',
          file_url: constructFileUrl(file)
        })) || []),
      ];
      console.log('Processed files:', allFiles);

      setFiles(allFiles);
      setFilteredFiles(allFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Fetch user data and set initial student
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('/users/me/');
        if (response.status === 200) {
          const data = response.data;
          
          // Handle profile picture URL
          if (data.profile_picture_url) {
            data.profile_picture = data.profile_picture_url;
          }
          
          setUser(data);
          
          // If user is a teacher, set their ID as the initial selected student
          if (data.user_type === 'teacher') {
            setSelectedStudentId(data.id);
            setSelectedStudentName(`${data.first_name} ${data.last_name}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, []);

  // Fetch students with proper filtering
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get('/files/students/list/', {
          headers: {
            'X-CSRFToken': getCsrfToken(),
          },
          credentials: 'include',
        });
        
        // Filter out any invalid student entries
        const validStudents = response.data.filter(student => 
          student && student.id && student.first_name && student.last_name
        );
        
        setStudents(validStudents);

        // Only set first student as default for non-teacher users
        if (validStudents.length > 0 && user && user.user_type !== 'teacher') {
          const firstStudent = validStudents[0];
          setSelectedStudentId(firstStudent.id);
          setSelectedStudentName(`${firstStudent.first_name} ${firstStudent.last_name}`);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    
    if (user) {
      fetchStudents();
    }
  }, [user]);

  // Re-fetch files when the selected student changes
  useEffect(() => {
    fetchFiles();
  }, [selectedStudentId]);

  // Update filtered files based on filters
  useEffect(() => {
    let newFiles = [...files];
    if (filters.type !== 'all') {
      newFiles = newFiles.filter((file) => file.type === filters.type);
    }
    if (filters.searchTerm) {
      newFiles = newFiles.filter((file) =>
        file.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    setFilteredFiles(newFiles);
  }, [filters, files]);

  // File upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    if (!title.trim()) {
      alert('Please provide a title for the file.');
      return;
    }

    // File size validation
    const MB = 1024 * 1024;
    const fileSizeMB = file.size / MB;
    
    // Get file extension and MIME type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileMimeType = file.type;
    console.log('Original file name:', file.name);
    console.log('File MIME type:', fileMimeType);
    console.log('File extension:', fileExtension);
    console.log('File size:', fileSizeMB.toFixed(2), 'MB');

    // More comprehensive file type detection
    let detectedType;
    let maxSize;
    const allowedExtensions = {
      audio: ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'wma'],
      video: ['mp4', 'webm', 'avi', 'mov', 'mkv', 'wmv', 'mpeg'],
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      document: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
    };

    if (fileMimeType.startsWith('audio/') || allowedExtensions.audio.includes(fileExtension)) {
      detectedType = 'audio';
      maxSize = 30; // 30MB limit for audio
    } else if (fileMimeType.startsWith('video/') || allowedExtensions.video.includes(fileExtension)) {
      detectedType = 'video';
      maxSize = 100; // 100MB limit for video
    } else if (fileMimeType.startsWith('image/') || allowedExtensions.image.includes(fileExtension)) {
      detectedType = 'image';
      maxSize = 10; // 10MB limit for images
    } else if (fileMimeType.startsWith('application/pdf') || 
               fileMimeType.startsWith('application/msword') ||
               fileMimeType.startsWith('application/vnd.openxmlformats-officedocument') ||
               fileMimeType.startsWith('text/') ||
               allowedExtensions.document.includes(fileExtension)) {
      detectedType = 'document';
      maxSize = 50; // 50MB limit for documents
    } else {
      alert('Unsupported file type. Please upload a document, image, audio, or video file.');
      return;
    }

    // Check file size
    if (fileSizeMB > maxSize) {
      alert(`File size exceeds the ${maxSize}MB limit for ${detectedType} files. Your file is ${fileSizeMB.toFixed(2)}MB.`);
      return;
    }

    console.log('Detected file type:', detectedType);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('fileType', detectedType);
    formData.append('originalExtension', fileExtension);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const endpoint = `/files/private/all-files/${selectedStudentId || 'default'}/`;
      console.log('Uploading to endpoint:', endpoint);
      
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': getCsrfToken(),
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      console.log('Upload response:', response.data);
      alert('File uploaded successfully!');
      
      // Add the new file to the state with the correct type and extension
      const newFile = {
        id: response.data.id,
        title: response.data.title,
        type: detectedType,
        file_url: response.data.file_url,
        sender: response.data.sender,
        uploaded_at: new Date().toISOString(),
        originalExtension: fileExtension // Store the original extension
      };

      setFiles(prevFiles => [newFile, ...prevFiles]);
      setFile(null);
      setTitle('');
      setIsUploading(false);
      setUploadProgress(0);
      
      // Refresh the file list
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // File download handler with proper error handling
  const handleDownload = async (fileId, fileName, fileType) => {
    try {
        // Construct the correct endpoint based on file type
        let downloadUrl;
        switch (fileType) {
            case 'document':
                downloadUrl = `/files/private/documents/${fileId}/download/`;
                break;
            case 'image':
                downloadUrl = `/files/private/images/${fileId}/download/`;
                break;
            case 'audio':
                downloadUrl = `/files/private/audio/${fileId}/download/`;
                break;
            case 'video':
                downloadUrl = `/files/private/video/${fileId}/download/`;
                break;
            default:
                throw new Error('Unknown file type');
        }

        console.log('Attempting to download from:', downloadUrl);

        const response = await apiClient.get(downloadUrl, {
            responseType: 'blob',
            headers: {
                'X-CSRFToken': getCsrfToken(),
            }
        });

        // Get content type and original filename from headers
        const contentType = response.headers['content-type'];
        const contentDisposition = response.headers['content-disposition'];
        console.log('Response headers:', {
            contentType,
            contentDisposition
        });

        // Extract filename from Content-Disposition header if available
        let downloadFileName = fileName;
        const matches = contentDisposition && /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches && matches[1]) {
            downloadFileName = matches[1].replace(/['"]/g, '');
        }

        // If filename includes path, get just the filename
        if (downloadFileName.includes('/')) {
            downloadFileName = downloadFileName.split('/').pop();
            downloadFileName = decodeURIComponent(downloadFileName);
        }

        // Create blob with the correct content type
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFileName);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('Download completed successfully');
    } catch (error) {
        console.error('Error downloading file:', error);
        console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
        });

        // Show user-friendly error message
        let errorMessage = 'Error downloading file. ';
        if (error.response?.status === 404) {
            errorMessage += 'File not found.';
        } else if (error.response?.status === 403) {
            errorMessage += 'You do not have permission to download this file.';
        } else if (error.response?.status === 500) {
            errorMessage += 'Server error. Please try again later.';
        } else {
            errorMessage += 'Please try again.';
        }
        alert(errorMessage);
    }
  };

  // Delete file handler
  const handleDeleteFile = async (file) => {
    if (!file || !file.type || !file.id) {
      console.error('Invalid file object:', file);
      return;
    }

    try {
      const confirmation = window.confirm('Are you sure you want to delete this file?');
      if (!confirmation) return;
    
      // Prevent multiple deletes of the same file
      if (file.isDeleting) {
        console.log('Delete already in progress for file:', file.id);
        return;
      }

      // Mark file as being deleted
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id ? { ...f, isDeleting: true } : f
        )
      );
    
      // Construct the delete URL based on the file type
      let deleteUrl = '';
      switch (file.type) {
        case 'document':
          deleteUrl = `/files/private/documents/${file.id}/`;
          break;
        case 'image':
          deleteUrl = `/files/private/images/${file.id}/`;
          break;
        case 'audio':
          deleteUrl = `/files/private/audio/${file.id}/`;
          break;
        case 'video':
          deleteUrl = `/files/private/video/${file.id}/`;
          break;
        default:
          console.error('Unknown file type for deletion');
          return;
      }
    
      console.log('Deleting file:', { id: file.id, type: file.type, url: deleteUrl });
      const response = await apiClient.delete(deleteUrl, {
        headers: { 'X-CSRFToken': getCsrfToken() },
      });
    
      if (response.status === 204) {
        // Remove the file from both states
        const removeFile = (prevFiles) => prevFiles.filter(f => f.id !== file.id);
        setFiles(prevFiles => {
          const newFiles = removeFile(prevFiles);
          setFilteredFiles(removeFile(filteredFiles)); // Update filtered files synchronously
          return newFiles;
        });
        console.log('File deleted successfully:', file.id);
      } else {
        alert('Failed to delete the file.');
        // Remove the deleting flag if failed
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id ? { ...f, isDeleting: false } : f
          )
        );
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting the file. Please try again.');
      // Remove the deleting flag if failed
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id ? { ...f, isDeleting: false } : f
        )
      );
    }
  };

  // Render
  if (user) {
    return (
      <div className="file-dashboard-container mt-20 mb-2">
        <h1 className="dashboard-title">
          <div className="flex items-center ml-20">
            <div className="w-24 h-24 relative mr-6">
              <ProfileImage 
                src={user?.profile_picture}
                userName={user?.first_name}
              />
            </div>
            {selectedStudentName ? `${selectedStudentName}'s Dashboard` : 'File Dashboard'}
            <div className="flex items-center pl-40 italic">
              <p className="text-lg">(INSTRUCTIONS: Here you can exchange general files with your teacher)</p>
            </div>
          </div>
        </h1>
    
        <div className="dashboard-content">
          <aside className="sidebar">
            <div className="upload-form">
              <h3 className="text-xl font-semibold mb-4">Upload File</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File:</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mt-1 block w-full"
                    required
                  />
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
              </form>
            </div>

            <FileFilterPanel filters={filters} setFilters={setFilters} />
          </aside>

          <main className="file-list">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => {
                const key = file.uniqueKey || `${file.id}-${file.type || 'unknown'}-${index}`;
                return (
                  <FileCard
                    key={key}
                    file={file}
                    onDownload={() => handleDownload(file.id, file.title, file.type)}
                    onDelete={handleDeleteFile}
                  />
                );
              })
            ) : (
              <p className="no-files-message">No files match your filters.</p>
            )}
          </main>
        </div>

        {/* Only show student selection for teachers */}
        {user?.user_type === 'teacher' && (
          <div className="mt-3">
            <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Select Dashboard to View
            </label>
            <select
              id="studentSelect"
              onChange={(e) => {
                const student = students.find(s => s.id === Number(e.target.value));
                setSelectedStudentId(Number(e.target.value));
                setSelectedStudentName(student ? `${student.first_name} ${student.last_name}` : '');
              }}
              value={selectedStudentId || ""}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {/* Add teacher as first option */}
              {user && (
                <option value={user.id}>
                  My Dashboard
                </option>
              )}
              {students
                .filter(student => student && student.id && student.first_name && student.last_name)
                .map((student) => (
                  <option key={student.id} value={student.id}>
                    {`${student.first_name} ${student.last_name}`}
                  </option>
                ))
              }
            </select>
          </div>
        )}
      </div>
    );
  }

  // Loading state or unauthenticated view
  return <div>Loading dashboard or user not authenticated...</div>;
};

export default FileDashboard;