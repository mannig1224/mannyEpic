import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './RoomsSection.module.css'; // Import the CSS module for styling

const RoomsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  
  // Sample room data (you can modify this or replace it with dynamic data)
  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105', 'Room 106','Room 1017', 'Room 108', 'Room 109', 'Room 114', 'Room 115', 'Room 116'];

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
  if (window.confirm(`Are you sure you want to delete ${room}?`)) {
    // Logic for deleting the room (e.g., make an API call or update state)
    alert(`Deleted: ${room}`);
  }
};

  // Get the filtered list based on the search term
  const filteredRooms = rooms.filter(room =>
    room.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span>{room}</span>

              <div className={styles.actions}>
                {/* Edit Button */}
                <FontAwesomeIcon
                  icon={faEdit}
                  className={styles.editIcon}
                  onClick={() => handleEditRoom(room)}
                />
                {/* Delete Button */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteRoom(room)}
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
        <button className={styles.addButton}>
          Add Room
        </button>
      </div>
    </div>
  );
};

export default RoomsSection;