import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import styles from './RoomsSection.module.css'; // Import the CSS module for styling
import { useMaps, Room } from '../../context/MapsContext';
import Modal from '../Modal/Modal';


const RoomsSection: React.FC = () => {
  const { selectedMap, drawMode, toggleDrawMode, removeRoom, duplicateRoom, editRoom, createRoomsFromCorners } = useMaps();
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom,] = useState<Room | null>(null);
  const [loadingOpenCV, setLoadingOpenCV] = useState(false);
  // Sample room data (you can modify this or replace it with dynamic data)
  const rooms = selectedMap?.rooms || [];


  // Call OpenCV API to detect corners
  const callOpenCV = async () => {
    if (!selectedMap) {
      console.error('No image selected for the map');
      return;
    }

    try {
      setLoadingOpenCV(true);

      // Fetch the image from the public folder using the imagePath
      const imageUrl = `${window.location.origin}${selectedMap.imagePath}`;
      const imageFile = await fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => new File([blob], 'mapImage.png', { type: 'image/png' }));

      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('image', imageFile);

      // Send API request to the Flask server
      const response = await fetch('http://127.0.0.1:5000/detect-corners', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Corners detected:', data);
      createRoomsFromCorners(data.corners);

      setLoadingOpenCV(false);
    } catch (error) {
      console.error('Error calling OpenCV API:', error);
      setLoadingOpenCV(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle Edit Room button click
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle saving the changes to the room
  const handleSaveChanges = () => {
    if (selectedRoom) {
      editRoom(selectedRoom.id, { name: selectedRoom.name }); // Update the room details using editRoom from context
      closeModal(); // Close the modal after saving changes
    }
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
                {/* Duplicate Button */}
                <FontAwesomeIcon
                  icon={faCopy}
                  className={styles.copyIcon}
                  onClick={() => duplicateRoom(room.id)}
                />
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
        <button
          className={`${styles.addButton} ${loadingOpenCV ? styles.drawingMode : ''}`}
          onClick={callOpenCV}
        >
          {drawMode ? 'Scanning...' : 'Scan Image'}
        </button>
      </div>


{/* Modal for Editing Room */}
{isModalOpen && selectedRoom && (
        <Modal onClose={closeModal}>
          <div className={styles.modalContent}>
            <h2>Edit Room</h2>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>
                Room Name:
                <input
                  type="text"
                  value={selectedRoom.name}
                  onChange={(e) =>
                    setSelectedRoom({ ...selectedRoom, name: e.target.value })
                  }
                  className={styles.inputField}
                />
              </label>
            </div>
            {/* You can add more inputs for editing other room details here */}
            <div className={styles.modalActions}>
              <button onClick={handleSaveChanges} className={styles.saveButton}>Save Changes</button>
              <button onClick={closeModal} className={styles.closeButton}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RoomsSection;