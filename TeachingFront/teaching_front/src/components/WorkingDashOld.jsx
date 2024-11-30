import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import FileCard from './FileCard';
import FileFilterPanel from './FileFilterPanel';
import './FileDashboard.css';

const FileDashboard = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', searchTerm: '' });

  // File Upload state
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('document');
  const [title, setTitle] = useState('');

  const [students, setStudents] = useState([]);


  
  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await apiClient.get('/students/list/'); // adjust path if needed
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
    fetchStudents();
  }, []);
  




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


  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await apiClient.get('/files/all/');
        const allFiles = [
          ...response.data.private_documents.map(file => ({ ...file, type: 'document' })),
          ...response.data.private_images.map(file => ({ ...file, type: 'image' })),
          ...response.data.private_audio.map(file => ({ ...file, type: 'audio' })),
          ...response.data.shared_documents.map(file => ({ ...file, type: 'document' })),
          ...response.data.shared_images.map(file => ({ ...file, type: 'image' })),
          ...response.data.shared_audio.map(file => ({ ...file, type: 'audio' })),
        ];
        setFiles(allFiles);
        setFilteredFiles(allFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
    fetchFiles();
  }, []);

  useEffect(() => {
    let newFiles = [...files];
    if (filters.type !== 'all') {
      newFiles = newFiles.filter(file => file.type === filters.type);
    }
    if (filters.searchTerm) {
      newFiles = newFiles.filter(file => file.title.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }
    setFilteredFiles(newFiles);
  }, [filters, files]);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFileTypeChange = (e) => setFileType(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);


  const handleUpload = async (e) => {
  e.preventDefault();

  if (!file || !title) {
    alert("Please select a file and provide a title.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('type', fileType);

  try {
    await apiClient.post('/admin-shared-documents/upload_file/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': getCsrfToken(),
      },
    });
    alert("File uploaded successfully!");

    // Refetch files
    const response = await apiClient.get('/files/all/');
    const allFiles = [
      ...response.data.private_documents.map(file => ({ ...file, type: 'document' })),
      ...response.data.private_images.map(file => ({ ...file, type: 'image' })),
      ...response.data.private_audio.map(file => ({ ...file, type: 'audio' })),
      ...response.data.shared_documents.map(file => ({ ...file, type: 'document' })),
      ...response.data.shared_images.map(file => ({ ...file, type: 'image' })),
      ...response.data.shared_audio.map(file => ({ ...file, type: 'audio' })),
    ];
    setFiles(allFiles);
    setFilteredFiles(allFiles);
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Error uploading file.");
  }
};


  return (
    <div className="file-dashboard-container">
      <h1 className="dashboard-title">Student File Dashboard</h1>

      <div className="dashboard-content">
        {/* Sidebar with File Upload and Filters */}
        <aside className="sidebar">
          <div className="file-upload">
            <h2>Upload a New File</h2>
            <form onSubmit={handleUpload}>
              <label htmlFor="title">File Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter file title"
                value={title}
                onChange={handleTitleChange}
                required
              />
              <label htmlFor="file">Select File</label>
              <input
                id="file"
                type="file"
                accept="image/*,audio/*,application/pdf"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="fileType">File Type</label>
              <select id="fileType" value={fileType} onChange={handleFileTypeChange}>
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
              <button type="submit" className="upload-button">Upload</button>
            </form>
          </div>

          <FileFilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        {/* File List Section */}
        <main className="file-list">
          {filteredFiles.length > 0 ? (
            filteredFiles.map(file => (
              <FileCard key={file.id} file={file} />
            ))
          ) : (
            <p className="no-files-message">No files match your filters.</p>
          )}
        </main>
      </div>
      <label htmlFor="studentSelect">Select Student</label>
<select id="studentSelect">
  <option value="all">All Students</option>
  {/* Dynamically render student options */}
  {students.map((student) => (
    <option key={student.id} value={student.id}>{student.name}</option>
  ))}
</select>
    </div>
  );
};

export default FileDashboard;
