import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const SharedDriveDashboard = () => {
  const [userRole, setUserRole] = useState("student");
  const [files, setFiles] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");

//Starts window at top
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/users/me/");
        console.log('User data response:', response.data);
        
        if (response.status === 200) {
          setUserRole(response.data.user_type?.toLowerCase() || 'student');
          console.log('User role set to:', response.data.user_type);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
          setUserRole('student'); // Default to student on error
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserRole('student'); // Default to student on error
      }
    };

    fetchUserData();
  }, []);

  const getCsrfToken = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith("csrftoken=")) {
        return cookie.substring("csrftoken=".length);
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        const response = await apiClient.get("/files/shared-files/");
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching shared files:", error);
      }
    };
    fetchSharedFiles();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await apiClient.get("/files/announcements/");
        console.log("Raw announcement data:", response.data);
        if (response.data && response.data.length > 0) {
          console.log("First announcement:", response.data[0]);
          console.log("Available fields:", Object.keys(response.data[0]));
        }
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", e.target.title.value);

    try {
      await apiClient.post("/files/shared-files/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": getCsrfToken(),
        },
      });
      alert("File uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  const handleSharedFileDownload = async (fileId, fileName) => {
    try {
      const response = await apiClient.get(`/files/shared-files/${fileId}/`, {
        responseType: "blob",
      });

      // Extract original filename from the URL or use the title
      let downloadFileName = fileName;
      if (fileName.includes('/')) {
        // If it's a URL, get just the filename part
        downloadFileName = fileName.split('/').pop();
        // Remove any URL encoding
        downloadFileName = decodeURIComponent(downloadFileName);
      }

      // Get content type and extension
      const contentType = response.headers["content-type"];
      const contentDisposition = response.headers["content-disposition"];
      const matches = /filename="(.+)"/.exec(contentDisposition);
      
      // Use server provided filename if available, otherwise use our processed filename
      const finalFileName = matches && matches[1] ? matches[1] : downloadFileName;

      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", finalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await apiClient.delete(`/files/shared-files/${id}/`, {
        headers: { "X-CSRFToken": getCsrfToken() },
      });
      setFiles(files.filter((file) => file.id !== id));
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const response = await apiClient.post(
          "/files/announcements/",
          {
            title: newTitle,
            content: newMessage,
            posted_at: new Date().toISOString()
          },
          { headers: { "X-CSRFToken": getCsrfToken() } }
        );

        console.log("New announcement response:", response.data); // Debug log
        
        // Add the new announcement with proper date to the state
        const newAnnouncement = {
          ...response.data,
          posted_at: new Date().toISOString()
        };
        setAnnouncements([newAnnouncement, ...announcements]);
        setNewMessage("");
        setNewTitle("");
      } catch (error) {
        console.error("Error posting announcement:", error);
      }
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await apiClient.delete(`/files/announcements/${id}/`, {
        headers: { "X-CSRFToken": getCsrfToken() },
      });
      setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
      alert("Announcement deleted successfully!");
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 mt-24">
      <div className="container mx-auto space-y-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 relative">
          <span className="relative inline-block">
            {userRole === "teacher" ? "Teacher's" : "Student"} shared files 
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform -skew-x-12"></div>
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Announcements Section */}
          <section className="backdrop-blur-sm bg-gradient-to-br from-emerald-100/95 via-white/90 to-green-100/95 rounded-lg p-6 shadow-xl border border-white/50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-2">📢</span>
              <span>Announcements</span>
            </h2>
            {userRole === "teacher" && (
              <form onSubmit={handleAnnouncementSubmit} className="mb-8 space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80"
                />
                <textarea
                  placeholder="Write your announcement..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] bg-white/80"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Post Announcement</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            )}
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-yellow-100/90 p-4 rounded-lg shadow-sm border-b-4 border-yellow-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                    {userRole === "teacher" && (
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{announcement.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {announcement.posted_at ? new Date(announcement.posted_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Recently added'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Shared Files Section */}
          <section className="backdrop-blur-sm bg-gradient-to-br from-teal-100/95 via-white/90 to-emerald-100/95 rounded-lg p-6 shadow-xl border border-white/50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-2">📁</span>
              <span>Shared Files</span>
            </h2>
            {userRole === "teacher" && (
              <form onSubmit={handleUpload} className="mb-8 space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="File title"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80"
                  required
                />
                <input
                  type="file"
                  name="file"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Upload File</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
              </form>
            )}
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-white/60 p-4 rounded-lg shadow-sm border border-white/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{file.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSharedFileDownload(file.id, file.file)}
                        className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      {userRole === "teacher" && (
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(file.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="custom-scrollbar-styles" />
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }
        `
      }} />
    </div>
  );
};

export default SharedDriveDashboard;
