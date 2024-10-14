"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Define types for Map and Room
interface Room {
  id: string;
  name: string;
  coordinates: number[];
}

interface Map {
  id: string;
  name: string;
  imagePath: string;
  rooms: Room[];
}

interface MapsContextType {
  maps: Map[];
  selectedMapId: string | null;
  selectMap: (mapId: string) => void;
  updateRoomCoordinates: (roomId: string, newCoordinates: number[]) => void;
  addNewRoom: (coordinates: number[]) => void;
  drawMode: boolean;
  toggleDrawMode: () => void;
  selectedMapRooms: Room[] | null;
  selectedMap: Map | null;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export const MapsProvider = ({ children }: { children: ReactNode }) => {
  // Mock data for maps and rooms
  const [maps, setMaps] = useState<Map[]>([
    {
        id: "1",
        name: "School Map 1",
        imagePath: "/images/workspace.png",
        rooms: [
          { id: uuidv4(), name: "Classroom 101", coordinates: [100, 100, 150, 50, 200, 100] },
          { id: uuidv4(), name: "Library", coordinates: [250, 100, 250, 150, 300, 150, 300, 100] },
          { id: uuidv4(), name: "Classroom 102", coordinates: [300, 200, 350, 200, 350, 250, 300, 250] },
          { id: uuidv4(), name: "Cafeteria", coordinates: [400, 300, 450, 300, 450, 350, 400, 350] },
          { id: uuidv4(), name: "Classroom 103", coordinates: [500, 100, 550, 100, 550, 150, 500, 150] },
          { id: uuidv4(), name: "Computer Lab", coordinates: [150, 300, 200, 300, 200, 350, 150, 350] },
          { id: uuidv4(), name: "Gymnasium", coordinates: [600, 200, 700, 200, 700, 300, 600, 300] },
          { id: uuidv4(), name: "Science Lab", coordinates: [250, 400, 300, 400, 300, 450, 250, 450] },
          { id: uuidv4(), name: "Art Room", coordinates: [350, 500, 400, 500, 400, 550, 350, 550] },
        ],
      },
      {
        id: "2",
        name: "School Map 2",
        imagePath: "/images/workspace.png",
        rooms: [
          { id: uuidv4(), name: "Classroom 201", coordinates: [411.8, 481.6, 411.8, 531.6, 461.8, 531.6, 461.8, 481.6] },
          { id: uuidv4(), name: "Gym", coordinates: [500, 200, 550, 200, 550, 300, 500, 300] },
        ],
      },
  ]);


    // Initially set the selectedMapId to null, and assign the first map later using useEffect
    const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  // Drawing mode state
  const [drawMode, setDrawMode] = useState<boolean>(false);

  // Set the selected map to the first one when component mounts
  useEffect(() => {
    if (maps.length > 0 && !selectedMapId) {
      setSelectedMapId(maps[0].id);
    }
  }, [maps, selectedMapId]);

  // Function to toggle drawing mode
  const toggleDrawMode = () => {
    setDrawMode((prev) => !prev);
  };

  const selectedMap = selectedMapId !== null ? maps.find((map) => map.id === selectedMapId) || null : null;
  const selectedMapRooms = selectedMap?.rooms || null;

  const selectMap = (mapId: string) => {
    setSelectedMapId(mapId);
  };

  // Function to update the coordinates of a room
  const updateRoomCoordinates = (roomId: string, newCoordinates: number[]) => {
    setMaps((prevMaps) =>
      prevMaps.map((map) => {
        if (map.id === selectedMapId) {
          return {
            ...map,
            rooms: map.rooms.map((room) =>
              room.id === roomId ? { ...room, coordinates: newCoordinates } : room
            ),
          };
        }
        return map;
      })
    );
  };



  const addNewRoom = (coordinates: number[]) => {
    console.log("Attempting to add new room...");
  
    setMaps((prevMaps) => {
      console.log("Inside setMaps callback for adding new room...");
  
      return prevMaps.map((map) => {
        if (map.id === selectedMapId) {
          // Check if there is already a room with the same name
          const newRoomName = `Room ${map.rooms.length + 1}`;
          const roomExists = map.rooms.some((room) => room.name === newRoomName);
  
          if (roomExists) {
            console.warn(`Room with the name "${newRoomName}" already exists. Room not added.`);
            return map; // Return without adding the room if it already exists
          }
  
          // Create a unique ID for the new room using uuid
          const newRoomId = uuidv4();
  
          // Create the new room object
          const newRoom: Room = {
            id: newRoomId,
            name: newRoomName,
            coordinates: coordinates,
          };
  
          console.log("Adding new room to context:", newRoom);
  
          // Add the new room to the selected map
          return {
            ...map,
            rooms: [...map.rooms, newRoom],
          };
        }
        return map;
      });
    });
    setDrawMode(false);
  };
  



  return (
    <MapsContext.Provider 
        value={{ 
            maps, 
            selectedMapId, 
            selectMap, 
            updateRoomCoordinates, 
            addNewRoom, 
            drawMode,
            toggleDrawMode,
            selectedMapRooms, 
            selectedMap 
        }}
            >
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
