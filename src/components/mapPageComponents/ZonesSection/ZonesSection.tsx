import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './ZonesSection.module.css'; // Import the CSS module for styling

const ZonesSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input


  // Sample zone data (you can modify this or replace it with dynamic data)
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle Edit Zone (logic can be customized)
  const handleEditZone = (zone: string) => {
    alert(`Editing: ${zone}`);
    // You can implement your edit logic here (e.g., open a modal for editing)
  };

  // Handle Delete Zone (logic can be customized)
  const handleDeleteZone = (zone: string) => {
    if (window.confirm(`Are you sure you want to delete ${zone}?`)) {
      // Logic for deleting the zone (e.g., make an API call or update state)
      alert(`Deleted: ${zone}`);
    }
  };

  // Get the filtered list based on the search term
  const filteredZones = zones.filter(zone =>
    zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.zonesContainer}>
      {/* Search bar for filtering zones */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          placeholder="Search zones..."
        />
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> {/* Search Icon */}
      </div>

      {/* Scrollable list of zones with Edit and Delete buttons */}
      <div className={styles.scrollableList}>
        {filteredZones.length > 0 ? (
          filteredZones.map((zone, index) => (
            <div key={index} className={styles.listItem}>
              <span>{zone}</span>

              <div className={styles.actions}>
                {/* Edit Button */}
                <FontAwesomeIcon
                  icon={faEdit}
                  className={styles.editIcon}
                  onClick={() => handleEditZone(zone)}
                />
                {/* Delete Button */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteZone(zone)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>No zones found</div>
        )}
      </div>

      {/* Add Zone Button */}
      <div className={styles.buttonContainer}>
        <button className={styles.addButton}>
          Add Zone
        </button>
      </div>
    </div>
  );
};

export default ZonesSection;
