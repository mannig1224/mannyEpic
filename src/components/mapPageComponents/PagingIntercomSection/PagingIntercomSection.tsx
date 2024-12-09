import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './PagingIntercomSection.module.css'; // Import the CSS module for styling

const PagingIntercomSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [showOption, setShowOption] = useState(''); // State for showing either Rooms or Zones
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State for multiple selections

  // Sample room and zone data
  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105', 'Room 106'];
  const zones = ['Zone A', 'Zone B', 'Zone C'];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle selection of either "Rooms" or "Zones"
  const handleShowOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShowOption(e.target.value);
    setSelectedItems([]); // Clear selected items when switching options
  };

  // Handle checkbox toggle (select or deselect a room/zone)
  const handleCheckboxChange = (item: string) => {
    if (selectedItems.includes(item)) {
      // Deselect the item (remove it from the selected list)
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      // Select the item (add it to the selected list)
      setSelectedItems([...selectedItems, item]);
    }
  };
    // Handle clearing the selection
    const handleClearSelection = () => {
        setSelectedItems([]); // Clear selected items
    };
    // Handle start paging (this can be where you add the logic for paging)
  const handleStartPaging = () => {
    if (selectedItems.length > 0) {
      alert(`Paging to: ${selectedItems.join(', ')}`);
    } else {
      alert('No rooms/zones selected for paging.');
    }
  };
  // Get the filtered list based on the selected option (Rooms or Zones) and the search term
  const filteredItems = showOption === 'Rooms'
    ? rooms.filter(room => room.toLowerCase().includes(searchTerm.toLowerCase()))
    : zones.filter(zone => zone.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={styles.pagingIntercomContainer}>
      {/* Search bar for filtering rooms/zones */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          placeholder="Search..."
        />
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> {/* Search Icon */}
      </div>

      {/* Dropdown for selecting "Rooms" or "Zones" */}
      <div className={styles.selectionContainer}>
        <label htmlFor="showOptionSelect" className={styles.selectLabel}>Show me:</label>
        <select
          id="showOptionSelect"
          value={showOption}
          onChange={handleShowOptionChange}
          className={styles.roomSelect}
        >
          <option value="" disabled>Select Rooms or Zones</option>
          <option value="Rooms">Rooms</option>
          <option value="Zones">Zones</option>
        </select>
      </div>

      {/* Scrollable list of rooms/zones styled like the image you shared */}
      {showOption && (
        <div className={styles.scrollableList}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.listItem} ${
                  selectedItems.includes(item) ? styles.selected : ''
                }`}
                onClick={() => handleCheckboxChange(item)} // Handle item selection
              >
                <span>{item}</span>
                {selectedItems.includes(item) && (
                  <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                )}
              </div>
            ))
          ) : (
            <div className={styles.noItems}>No {showOption.toLowerCase()} found</div>
          )}
        </div>
      )}

        {/* Buttons for Clear Selection and Start Paging */}
        <div className={styles.buttonContainer}>
                <button onClick={handleClearSelection} className={styles.clearButton}>
                Clear Selection
                </button>
                <button onClick={handleStartPaging} className={styles.pagingButton}>
                Start Paging
                </button>
            </div>
    </div>
  );
};

export default PagingIntercomSection;
