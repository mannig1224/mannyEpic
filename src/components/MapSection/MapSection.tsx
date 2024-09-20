import React from 'react';
import MapContainer from '../MapContainer/MapContainer';
import styles from './MapSection.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

interface MapSectionProps {
  currentMap: string;
  onMapChange: (newMap: string) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ currentMap, onMapChange}) => {
  const maps = ['Map1', 'Emmanuel Gatica', 'Map3']; // Example map names

  const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onMapChange(event.target.value); // Call parent function to update state
  };

  return (
    <div className={`${styles.mapSection}`}>
      <div className={styles.mapHeader}>
        {/* Custom dropdown under the map title */}
        <div className={styles.customSelectContainer}>
          <select
            onChange={handleMapChange}
            value={currentMap}
            className={styles.customSelect}
          >
            {maps.map((map) => (
              <option key={map} value={map} className={styles.customOption}>
                {map}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons for settings and page entire school */}
        <div className={styles.buttonContainer}>
          <button className={styles.pageButton}>Page Entire School</button>
          <button className={styles.settingsIcon}>
            <FontAwesomeIcon icon={faCog} size="sm" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer currentMap={currentMap} />
    </div>
  );
};

export default MapSection;
