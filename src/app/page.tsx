"use client";
import React, { useState } from 'react';
import HomeLeftSection from '../components/HomeLeftSection/HomeLeftSection'; // No need for .tsx extension
import HomeRightSection from '../components/HomeRightSection/HomeRightSection'; // No need for .tsx extension
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [currentMap, setCurrentMap] = useState<string>('Map1'); // Move state to parent

  const handleMapChange = (newMap: string) => {
    setCurrentMap(newMap);
  };

  return (
    <main className={styles.mainContent}>
      <HomeLeftSection currentMap={currentMap} onMapChange={handleMapChange} /> {/* Pass state to MapSection */}
      
      <HomeRightSection />
      
    </main>
  );
};

export default Home;
