import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './DoorsSection.module.css'; // Import the CSS module for styling

const DoorsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State for multiple selections

  // Sample door data (you can modify this or replace it with dynamic data)
  const doors = ['Front Door', 'Back Door', 'Garage Door', 'Side Door', 'Main Entrance'];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle Edit Door (logic can be customized)
  const handleEditDoor = (door: string) => {
    alert(`Editing: ${door}`);
    // You can implement your edit logic here (e.g., open a modal for editing)
  };

  // Handle Delete Door (logic can be customized)
  const handleDeleteDoor = (door: string) => {
    if (window.confirm(`Are you sure you want to delete ${door}?`)) {
      // Logic for deleting the door (e.g., make an API call or update state)
      alert(`Deleted: ${door}`);
    }
  };

  // Get the filtered list based on the search term
  const filteredDoors = doors.filter(door =>
    door.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.doorsContainer}>
      {/* Search bar for filtering doors */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          placeholder="Search doors..."
        />
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> {/* Search Icon */}
      </div>

      {/* Scrollable list of doors with Edit and Delete buttons */}
      <div className={styles.scrollableList}>
        {filteredDoors.length > 0 ? (
          filteredDoors.map((door, index) => (
            <div key={index} className={styles.listItem}>
              <span>{door}</span>

              <div className={styles.actions}>
                {/* Edit Button */}
                <FontAwesomeIcon
                  icon={faEdit}
                  className={styles.editIcon}
                  onClick={() => handleEditDoor(door)}
                />
                {/* Delete Button */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteDoor(door)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>No doors found</div>
        )}
      </div>

      {/* Add Door Button */}
      <div className={styles.buttonContainer}>
        <button className={styles.addButton}>
          Add Door
        </button>
      </div>
    </div>
  );
};

export default DoorsSection;
