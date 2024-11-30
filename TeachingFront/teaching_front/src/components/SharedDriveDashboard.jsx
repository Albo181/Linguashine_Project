import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const SharedDriveDashboard = () => {
  const [userRole, setUserRole] = useState("student");
  const [files, setFiles] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/users/me/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.user_type);
        } else if (response.status === 401) {
          console.log("User not authenticated");
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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

      const contentDisposition = response.headers["content-disposition"];
      const matches = /filename="(.+)"/.exec(contentDisposition);
      const serverFileName = matches && matches[1] ? matches[1] : fileName;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", serverFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          },
          { headers: { "X-CSRFToken": getCsrfToken() } }
        );

        setAnnouncements([response.data, ...announcements]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-blue-800 p-6">
      <div className="container mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {userRole === "teacher" ? "Teacher" : "Student"} Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Announcements Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📢 Post-its</h2>
            {userRole === "teacher" && (
              <form onSubmit={handleAnnouncementSubmit} className="mb-6 space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Write your announcement..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Post Announcement
                </button>
              </form>
            )}
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 border rounded bg-yellow-200 shadow-md"
                >
                  <h3 className="font-bold text-lg">{announcement.title}</h3>
                  <p className="text-gray-600">{announcement.content}</p>
                  {userRole === "teacher" && (
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="text-red-600 hover:underline mt-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Shared Files Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📂 Shared Files</h2>
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded bg-white shadow-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">{file.title}</h3>
                  </div>
                  <div>
                    <button
                      onClick={() => handleSharedFileDownload(file.id, file.title)}
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </button>
                    {userRole === "teacher" && (
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-600 hover:underline ml-4"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {userRole === "teacher" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Upload a File</h3>
                <form onSubmit={handleUpload} className="space-y-2">
                  <input
                    type="text"
                    name="title"
                    placeholder="File Title"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="file"
                    name="file"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Upload File
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SharedDriveDashboard;
