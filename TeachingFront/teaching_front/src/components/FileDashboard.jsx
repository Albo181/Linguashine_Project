import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import FileCard from './FileCard';
import FileFilterPanel from './FileFilterPanel';
import './FileDashboard.css';

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
    if (!selectedStudentId) return; // Prevent fetching for null or undefined student IDs
    try {
      const endpoint = `/files/private/all-files/${selectedStudentId}/`;
      const response = await apiClient.get(endpoint);
      console.log(response.data);  // Log the response to ensure file data is correct

      const allFiles = [
        ...(response.data.private_documents?.map((file) => ({ ...file, type: 'document' })) || []),
        ...(response.data.private_images?.map((file) => ({ ...file, type: 'image' })) || []),
        ...(response.data.private_audio?.map((file) => ({ ...file, type: 'audio' })) || []),
        ...(response.data.private_videos?.map((file) => ({ ...file, type: 'video' })) || []),
      ];
      console.log('Fetched files:', allFiles);

      setFiles(allFiles);
      setFilteredFiles(allFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/users/me/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
          },
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          console.warn('User not authenticated');
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get('/files/students/list/', {
          headers: {
            'X-CSRFToken': getCsrfToken(),
          },
          credentials: 'include',
        });
        setStudents(response.data);
  
        if (response.data.length > 0) {
          const firstStudent = response.data[0];
          setSelectedStudentId(firstStudent.id);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);
  

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

    if (!file || !title) {
      alert('Please select a file and provide a title.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('fileType', fileType);

    try {
      const endpoint = `/files/private/all-files/${selectedStudentId || 'default'}/`;
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': getCsrfToken(),
        },
      });

      
      alert('File uploaded successfully!');

      const newFile = {
        id: response.data.id,
        title,
        type: fileType,
        ...response.data,
      };

      setFiles((prevFiles) => [newFile, ...prevFiles]);
      setFile(null);
      setTitle('');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

    // File download handler
    const handleFileDownload = async (fileId, fileName) => {
      try {
        const response = await apiClient.get(`/files/download/${fileId}/`, {
          responseType: 'blob',
        });
  
        const contentDisposition = response.headers['content-disposition'];
        const matches = /filename="(.+)"/.exec(contentDisposition);
        const serverFileName = matches && matches[1] ? matches[1] : fileName;
  
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', serverFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file. Please try again.');
      }
    };
  
    // Fetch selected student's full name
    useEffect(() => {
      const student = students.find((student) => student.id === selectedStudentId);
      setSelectedStudentName(student ? `${student.first_name} ${student.last_name}` : '');
    }, [selectedStudentId, students]);
  
    
    
    
    const handleDeleteFile = async (file) => {
      if (!file || !file.type) {
        console.error('Invalid file object:', file);
        return;
      }
    try {
        const confirmation = window.confirm('Are you sure you want to delete this file?');
        if (!confirmation) return;
    
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
    
        console.log('Delete URL:', deleteUrl); // Check the constructed URL
    const response = await apiClient.delete(deleteUrl, {
          headers: { 'X-CSRFToken': getCsrfToken() },
        });
    
        if (response.status === 204) {
          // Remove the file from the state after successful deletion
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
          setFilteredFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
          alert('File deleted successfully.');
        } else {
          alert('Failed to delete the file.');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Error deleting the file. Please try again.');
      }
    };
    
    
    
    







// Render
if (user) {
  return (
    <div className="file-dashboard-container mt-20 mb-2">
      <h1 className="dashboard-title">
        <div className="flex items-center ml-20">
          {/* User Profile Picture */}
          <img
            src={`http://127.0.0.1:8000${user.profile_picture}`}
            alt={`${user.first_name}'s profile`}
            className="w-1/12 rounded-full mr-6 border-2 border-blue-700 shadow-custom"
          />
          {/* Displaying Student's Dashboard Title */}
          {selectedStudentName ? `${selectedStudentName}'s Dashboard` : 'Student File Dashboard'}
          <div className="flex items-center pl-40 italic">
            <p className="text-lg">(INSTRUCTIONS: Here you can exchange general files with your teacher)</p>
          </div>
        </div>
      </h1>
    
  



      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="file-upload">
            <h2>Upload files to teacher</h2>
            <form onSubmit={handleUpload} encType="multipart/form-data">
              <label htmlFor="title">File Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter file title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label htmlFor="file">Select File</label>
              <input
                id="file"
                type="file"
                accept="image/*,audio/*,video/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <label htmlFor="fileType">File Type</label>
              <select id="fileType" value={fileType} onChange={(e) => setFileType(e.target.value)}>
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
              <button type="submit" className="upload-button">Upload</button>
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
                  onDownload={() => handleFileDownload(file.id, file.title)}
                  onDelete={(file) => handleDeleteFile(file)}  // Pass file object to the delete function
                />
              );
            })
          ) : (
            <p className="no-files-message">No files match your filters.</p>
          )}
        </main>
      </div>

      {/* Student Selection */}
      <label htmlFor="studentSelect" className="mt-3">Select Student</label>
      <select
        id="studentSelect"
        onChange={(e) => setSelectedStudentId(e.target.value)}
        value={selectedStudentId || ""}
        className="mt-1"
      >
        {students.length > 0 ? (
          students.map((student) => (
            <option key={student.id} value={student.id}>
              {`${student.first_name} ${student.last_name}`}
            </option>
          ))
        ) : (
          <option value="">No students available</option>
        )}
      </select>
    </div>

  );
}

// Loading state or unauthenticated view
return <div>Loading dashboard or user not authenticated...</div>;
}

export default FileDashboard; 