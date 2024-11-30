import React from 'react';
import './FileCard.css';
import audio_icon from '../images/audio_icon.png';
import image_icon from '../images/image_icon.png';
import document_icon from '../images/document_icon.png';
import video_icon from '../images/video_icon.png';

const FileCard = ({ file, onDownload, onDelete }) => {
  // Helper function to get the correct icon based on the file type
  console.log("File sender is: ", file.sender);
  const getIcon = (type) => {
    switch (type) {
      case 'audio':
        return audio_icon;
      case 'image':
        return image_icon;
      case 'document':
        return document_icon;
      case 'video':
        return video_icon;
      default:
        return document_icon; // Default icon
    }
  };

  // Helper function to format the date and time
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="file-card border-2 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-gray-50 to-gray-100 relative">
      {/* Delete button (cross) */}
      <button
        onClick={() => onDelete(file)}  
        className="delete-button absolute top-2 right-2 text-red-500 hover:text-red-700"
        aria-label="Delete File"
        style={{ fontSize: '12px' }}  
      >
        ✖
      </button> 

      <div className="file-info flex items-center space-x-4 p-4">
        <img
          src={getIcon(file.type)}
          alt={file.type}
          className="w-11 h-11 border border-gray-200 rounded-full p-1"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{file.title}</h3>
          <p className="text-sm text-gray-500">
            {file.type} | {formatDateTime(file.uploaded_at)}
          </p>
        </div>
      </div>

      <div className="file-actions p-4 flex justify-between items-center">
        {/* Display sender directly as a string */}
        <span className="text-sm text-blue-400">
          Sender: {file.sender || 'Unknown'}
        </span>
        <button
          onClick={onDownload}
          className="mt-6 download-button text-blue-600 bg-blue-100 border border-blue-300 hover:bg-blue-200 transition-colors duration-200 font-semibold px-4 py-2 rounded"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default FileCard;
