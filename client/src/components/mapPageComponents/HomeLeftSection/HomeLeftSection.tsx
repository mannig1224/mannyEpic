import React from 'react';
import MapContainer from '../MapContainer/MapContainer';
import styles from './HomeLeftSection.module.css';
import { useMaps } from '../../../context/MapsContext';

interface HomeLeftSectionProps {
  currentMap: string;
  onMapChange: (newMap: string) => void;
}

const HomeLeftSection: React.FC<HomeLeftSectionProps> = ({ currentMap, onMapChange }) => {
  // Use MapsContext to get the list of maps and select a map
  const { maps, selectMap } = useMaps();

  const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMapName = event.target.value;
    const selectedMap = maps.find((map) => map.name === selectedMapName);
    
    if (selectedMap) {
      selectMap(selectedMap.id); // Update the selected map in context
      onMapChange(selectedMap.name); // Call the parent function to update local state
    }
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
              <option key={map.id} value={map.name} className={styles.customOption}>
                {map.name}
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
