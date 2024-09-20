import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PaperMap component to prevent SSR issues
const PaperMap = dynamic(() => import('../PaperMap/PaperMap'), { ssr: false });

interface MapContainerProps {
  currentMap: string; // Map name passed from the parent component
}

const MapContainer: React.FC<MapContainerProps> = ({ currentMap }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Render PaperMap component (only on the client-side) */}
      <PaperMap currentMap={currentMap} />
    </div>
  );
};

export default MapContainer;
