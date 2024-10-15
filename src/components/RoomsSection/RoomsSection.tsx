import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './RoomsSection.module.css'; // Import the CSS module for styling
import { useMaps } from '../../context/MapsContext';

const RoomsSection: React.FC = () => {
  const { selectedMap, drawMode, toggleDrawMode, removeRoom } = useMaps();
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  
  // Sample room data (you can modify this or replace it with dynamic data)
  const rooms = selectedMap?.rooms || [];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

// Handle Edit Room (logic can be customized)
const handleEditRoom = (room: string) => {
  alert(`Editing: ${room}`);
  // You can implement your edit logic here (e.g., open a modal for editing)
};

// Handle Delete Room (logic can be customized)
const handleDeleteRoom = (room: string) => {
  if (window.confirm(`Are you sure you want to delete this room?`)) {
    removeRoom(room);
  }
};

  // Get the filtered list based on the search term
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.roomsContainer}>
      {/* Search bar for filtering rooms */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          placeholder="Search rooms..."
        />
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> {/* Search Icon */}
      </div>

      {/* Scrollable list of rooms with Edit and Delete buttons */}
      <div className={styles.scrollableList}>
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, index) => (
            <div key={index} className={styles.listItem}>
              <span>{room.name}</span>

              <div className={styles.actions}>
                {/* Edit Button */}
                <FontAwesomeIcon
                  icon={faEdit}
                  className={styles.editIcon}
                  onClick={() => handleEditRoom(room.name)}
                />
                {/* Delete Button */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteRoom(room.id)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>No rooms found</div>
        )}
      </div>

      {/* Add Room Button */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.addButton} ${drawMode ? styles.drawingMode : ''}`}
          onClick={toggleDrawMode}
        >
          {drawMode ? 'Drawing...' : 'Draw Room'}
        </button>
      </div>
    </div>
  );
};

export default RoomsSection;