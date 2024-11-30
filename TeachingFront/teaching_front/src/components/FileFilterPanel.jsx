// FileFilterPanel.js
import React from 'react';
import './FileCard.css';

const FileFilterPanel = ({ filters, setFilters }) => {
  const handleTypeChange = (e) => setFilters(prev => ({ ...prev, type: e.target.value }));
  const handleSearchChange = (e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }));

  return (
    <div className="file-filter-panel mt-8">
      <select value={filters.type} onChange={handleTypeChange}>
        <option value="all">All Types</option>
        <option value="document">Documents</option>
        <option value="image">Images</option>
        <option value="audio">Audio</option>
      </select>
      <input
        type="text"
        placeholder="Search by title..."
        value={filters.searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default FileFilterPanel;
