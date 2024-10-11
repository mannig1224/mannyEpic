"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types for Map and Room
interface Room {
  id: number;
  name: string;
  coordinates: number[];
}

interface Map {
  id: number;
  name: string;
  imagePath: string;
  rooms: Room[];
}

interface MapsContextType {
  maps: Map[];
  selectedMapId: number | null;
  selectMap: (mapId: number) => void;
  selectedMapRooms: Room[] | null;
  selectedMap: Map | null;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export const MapsProvider = ({ children }: { children: ReactNode }) => {
  // Mock data for maps and rooms
  const [maps] = useState<Map[]>([
    {
      id: 1,
      name: "School Map 1",
      imagePath: "/images/workspace.png",
      rooms: [
        { id: 1, name: "Classroom 101", coordinates: [100, 100, 150, 50, 200, 100] },
        { id: 2, name: "Library", coordinates: [250, 100, 250, 150, 300, 150, 300, 100] },
        { id: 3, name: "Classroom 102", coordinates: [300, 200, 350, 200, 350, 250, 300, 250] },
        { id: 4, name: "Cafeteria", coordinates: [400, 300, 450, 300, 450, 350, 400, 350] },
        { id: 5, name: "Classroom 103", coordinates: [500, 100, 550, 100, 550, 150, 500, 150] },
        { id: 6, name: "Computer Lab", coordinates: [150, 300, 200, 300, 200, 350, 150, 350] },
        { id: 7, name: "Gymnasium", coordinates: [600, 200, 700, 200, 700, 300, 600, 300] },
        { id: 8, name: "Science Lab", coordinates: [250, 400, 300, 400, 300, 450, 250, 450] },
        { id: 9, name: "Art Room", coordinates: [350, 500, 400, 500, 400, 550, 350, 550] },
      ],
    },
    {
      id: 2,
      name: "School Map 2",
      imagePath: "/images/logo.png",
      rooms: [
        { id: 3, name: "Classroom 201", coordinates: [411.8, 481.6, 411.8, 531.6, 461.8, 531.6, 461.8, 481.6] },
        { id: 4, name: "Gym", coordinates: [500, 200, 550, 200, 550, 300, 500, 300] },
      ],
    },
  ]);

  // Set the selected map to the first map in the list by default
  const [selectedMapId, setSelectedMapId] = useState<number | null>(maps.length > 0 ? maps[0].id : null);

  const selectedMap = selectedMapId !== null ? maps.find((map) => map.id === selectedMapId) || null : null;
  const selectedMapRooms = selectedMap?.rooms || null;

  const selectMap = (mapId: number) => {
    setSelectedMapId(mapId);
  };

  return (
    <MapsContext.Provider value={{ maps, selectedMapId, selectMap, selectedMapRooms, selectedMap }}>
      {children}
    </MapsContext.Provider>
  );
};

// Custom hook to use the MapsContext
export const useMaps = () => {
  const context = useContext(MapsContext);
  if (!context) {
    throw new Error('useMaps must be used within a MapsProvider');
  }
  return context;
};
