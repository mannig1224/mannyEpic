import React from 'react';
import MapContainer from '../MapContainer/MapContainer';
import styles from './HomeLeftSection.module.css';


interface HomeLeftSectionProps {
  currentMap: string;
  onMapChange: (newMap: string) => void;
}

const HomeLeftSection: React.FC<HomeLeftSectionProps> = ({ currentMap, onMapChange}) => {
  const maps = ['Map1', 'Map2', 'Map3']; // Example map names

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
          
        </div>
      </div>

      {/* Map Container */}
      <MapContainer currentMap={currentMap} />
    </div>
  );
};

export default HomeLeftSection;
