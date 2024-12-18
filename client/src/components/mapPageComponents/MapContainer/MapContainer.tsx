import React from 'react';
import dynamic from 'next/dynamic'; // For dynamic imports, useful when integrating third-party libraries like Konva.js
import styles from './MapContainer.module.css';
// Define the props interface for the MapContainer component
interface MapContainerProps {
  currentMap: string; // The name of the current map passed from the parent component
}

// Dynamically import the KonvaMap component (client-side only)
const KonvaMap = dynamic<MapContainerProps>(() => import('../KonvaMap/KonvaMap'), { ssr: false });



const MapContainer: React.FC<MapContainerProps> = ({ currentMap }) => {
  return (
    <div className={styles.mapContainer}>
      <KonvaMap currentMap={currentMap} /> 
      {/* KonvaMap component dynamically loaded and passed the current map */}
    </div>
  );
};

export default MapContainer;
