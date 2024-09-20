"use client";
import React, { useState } from 'react';
import MapSection from '../components/MapSection/MapSection'; // Import MapSection
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [currentMap, setCurrentMap] = useState<string>('Map1'); // Move state to parent

  const handleMapChange = (newMap: string) => {
    setCurrentMap(newMap);
  };

  return (
    <main className={styles.mainContent}>
      <MapSection currentMap={currentMap} onMapChange={handleMapChange} /> {/* Pass state to MapSection */}

      <div className={styles.plainSection}>
        <p>This is the second div with some content.</p>
      </div>
    </main>
  );
};

export default Home;
