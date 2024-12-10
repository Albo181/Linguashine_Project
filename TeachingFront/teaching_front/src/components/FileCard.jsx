import React, { useState } from 'react';
import './FileCard.css';
import audio_icon from '../images/audio_icon.png';
import image_icon from '../images/image_icon.png';
import document_icon from '../images/document_icon.png';
import video_icon from '../images/video_icon.png';

const FileCard = ({ file, onDownload, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  // Helper function to get the correct icon based on the file type
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
    if (!dateTime) return 'Date not available';
    
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateTime);
        return 'Invalid date';
      }
      const formatter = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return formatter.format(date);
    } catch (error) {
      console.error('Error formatting date:', error, dateTime);
      return 'Invalid date';
    }
  };

  // Helper function to format sender name
  const formatSenderName = (sender) => {
    if (!sender) return 'Unknown';
    try {
      const { first_name, last_name } = sender;
      if (first_name && last_name) {
        return `${first_name} ${last_name}`;
      } else if (first_name) {
        return first_name;
      } else if (last_name) {
        return last_name;
      } else {
        return sender.username || 'Unknown';
      }
    } catch (error) {
      console.error('Error formatting sender name:', error);
      return 'Unknown';
    }
  };

  const renderFilePreview = () => {
    const previewStyle = {
      width: '120px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '8px',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (file.type === 'image' && !imageError) {
      return (
        <div style={previewStyle}>
          <img
            src={file.file_url || file.file}
            alt={file.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            onError={() => {
              console.error('Image failed to load:', file.file_url || file.file);
              setImageError(true);
            }}
          />
        </div>
      );
    }

    // For non-image files or if image fails to load, show icon
    return (
      <div style={previewStyle}>
        <img
          src={getIcon(file.type)}
          alt={file.type}
          style={{
            width: '60px',
            height: '60px',
            padding: '8px',
          }}
        />
      </div>
    );
  };

  return (
    <div className="file-card border-2 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-gray-50 to-gray-100 relative">
      <button
        onClick={() => onDelete(file)}  
        className="delete-button absolute top-2 right-2 text-red-500 hover:text-red-700"
        aria-label="Delete File"
        style={{ fontSize: '12px' }}  
      >
        ✖
      </button> 

      <div className="file-info flex items-center space-x-4 p-4">
        {renderFilePreview()}
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{file.title}</h3>
          <p className="text-sm text-gray-500">
            {file.type} | {formatDateTime(file.uploaded_at)}
          </p>
        </div>
      </div>

      <div className="file-actions p-4 flex justify-between items-center">
        <span className="text-sm text-blue-400">
          Sender: {formatSenderName(file.sender)}
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
