"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Define types for Map and Room
export interface Room {
  id: string;
  name: string;
  coordinates: number[];
  textCoordinates: number[];
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
  updateRoomCoordinates: (roomId: string, newCoordinates: number[], textCoordinates: number[]) => void;
  updateTextCoordinates: (roomId: string, newTextCoordinates: number[]) => void;
  addNewRoom: (coordinates: number[]) => void;
  removeRoom: (roomdId: string) => void;
  editRoom: (roomId: string, updatedRoomData: Partial<Room>) => void;
  duplicateRoom: (roomId: string) => void;
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
            {
              id: uuidv4(),
              name: "Classroom 101",
              coordinates: [
                468.1024862582756, 597.6500424294452, 
                465.11075749402943, 495.65004639673003, 
                552.1049832351069, 599.6500422768572
              ],
              textCoordinates: [495.7720756624707, 564.3167103670105]
            },
            {
              id: uuidv4(),
              name: "Library",
              coordinates: [
                462.7492929392111, 92.28250058879844,
                462.74929293921105, 185.9121660212048,
                552.009866821385, 186.78475932985296,
                550.7011810253125, 92.28250058879843
              ],
              textCoordinates: [507.55290893178, 139.31598163266365]
            },
            {
              id: uuidv4(),
              name: "Classroom 102",
              coordinates: [
                949.0109514698116, 186.83676140760528,
                1034.381637037875, 187.65946381962993,
                1033.5590629548967, 297.7167398974308,
                949.0109514698115, 298.5394423094554
              ],
              textCoordinates: [991.4906502330987, 242.68860135853086]
            },
            {
              id: uuidv4(),
              name: "Cafeteria",
              coordinates: [
                462.51563030634435, 285.19135658355594,
                551.1766122063202, 286.0140589955805,
                550.3540381233422, 385.3762037170608,
                463.33820438932264, 384.55350130503615
              ],
              textCoordinates: [506.34662175683285, 335.28378090080885]
            },
            {
              id: uuidv4(),
              name: "Classroom 103",
              coordinates: [
                722.9170447645452, 92.34719146957048,
                817.041356828923, 92.09209785188948,
                817.2964106558848, 186.47838732838085,
                722.6619909375835, 186.73348094606186
              ],
              textCoordinates: [769.9797007967341, 139.41278939897566]
            },
            {
              id: uuidv4(),
              name: "Computer Lab",
              coordinates: [
                463.9509968296843, 187.00000862121516,
                550.3726833198182, 187.26785691978017,
                550.640489838128, 285.48055066148635,
                463.14757727475484, 285.2127023629213
              ],
              textCoordinates: [507.02843681509686, 236.24027914135073]
            },
            {
              id: uuidv4(),
              name: "Gymnasium",
              coordinates: [
                634.1451933462922, 92.60541282232774,
                722.412717306053, 92.35031920464675,
                722.6677711330148, 186.22807238030313,
                634.1451933462922, 186.73825961566507
              ],
              textCoordinates: [678.342718032413, 139.98051600523568]
            },

          ],
      },
      {
        id: "2",
        name: "Home",
        imagePath: "/images/home.webp",
        rooms: [
          {
            id: uuidv4(),
            name: "Science Lab",
            coordinates: [250, 400, 300, 400, 300, 450, 250, 450],
            textCoordinates: [275, 425]
          },
          {
            id: uuidv4(),
            name: "Art Room",
            coordinates: [350, 500, 400, 500, 400, 550, 350, 550],
            textCoordinates: [375, 525]
          }
        ],
      },
      {
        id: "3",
        name: "Hospital",
        imagePath: "/images/hospital.webp",
        rooms: [
          {
            id: uuidv4(),
            name: "Science Lab",
            coordinates: [250, 400, 300, 400, 300, 450, 250, 450],
            textCoordinates: [275, 425]
          },
          {
            id: uuidv4(),
            name: "Art Room",
            coordinates: [350, 500, 400, 500, 400, 550, 350, 550],
            textCoordinates: [375, 525]
          }
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
  const updateRoomCoordinates = (
    roomId: string,
    newCoordinates: number[],
    newTextCoordinates: number[]
  ) => {
    if (newCoordinates.length < 6) {
      console.warn("Coordinates must contain at least four values (two points). Update aborted.");
      return;
    }
    setMaps((prevMaps) =>
      prevMaps.map((map) => {
        if (map.id === selectedMapId) {
          return {
            ...map,
            rooms: map.rooms.map((room) =>
              room.id === roomId
                ? { ...room, coordinates: newCoordinates, textCoordinates: newTextCoordinates }
                : room
            ),
          };
        }
        return map;
      })
    );
  };
  
  // Function to update only the text coordinates of a room
  const updateTextCoordinates = (roomId: string, newTextCoordinates: number[]) => {
    setMaps((prevMaps) =>
      prevMaps.map((map) => {
        if (map.id === selectedMapId) {
          return {
            ...map,
            rooms: map.rooms.map((room) =>
              room.id === roomId
                ? { ...room, textCoordinates: newTextCoordinates }
                : room
            ),
          };
        }
        return map;
      })
    );
  };
    // Function to calculate the centroid of a polygon
    const calculateCentroid = (points: number[]) => {
        let sumX = 0;
        let sumY = 0;
        const numPoints = points.length / 2;

        for (let i = 0; i < points.length; i += 2) {
        sumX += points[i];
        sumY += points[i + 1];
        }

        return [sumX / numPoints, sumY / numPoints];
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
  
          // Calculate the centroid for the text coordinates
          const textCoordinates = calculateCentroid(coordinates);
          // Create the new room object
          const newRoom: Room = {
            id: newRoomId,
            name: newRoomName,
            coordinates: coordinates,
            textCoordinates: textCoordinates,
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
  
  const removeRoom = (roomId: string) => {
    console.log("Attempting to remove room with ID:", roomId);

    setMaps((prevMaps) =>
      prevMaps.map((map) => {
        if (map.id === selectedMapId) {
          return {
            ...map,
            rooms: map.rooms.filter((room) => room.id !== roomId),
          };
        }
        return map;
      })
    );
  };

  const duplicateRoom = (roomId: string) => {
    const roomToDuplicate = selectedMap?.rooms.find((room) => room.id === roomId);
    if (!roomToDuplicate) {
      console.error("Room not found for duplication");
      return;
    }
  
    let duplicateNumber = 1;
    let newRoomName = `${roomToDuplicate.name} (${duplicateNumber})`;
  
    // Keep incrementing the number until a unique name is found
    while (selectedMap?.rooms.some((room) => room.name === newRoomName)) {
      duplicateNumber++;
      newRoomName = `${roomToDuplicate.name} (${duplicateNumber})`;
    }
  
    // Create new coordinates by adding an offset of a few pixels
    const offset = (10 * duplicateNumber); // 10 pixels offset
    const newCoordinates = roomToDuplicate.coordinates.map((point, idx) =>
      idx % 2 === 0 ? point + offset : point + offset
    );


    // Create a new room object with new coordinates and unique ID
    const newRoom = {
      ...roomToDuplicate,
      id: uuidv4(), // Assign a new unique ID for the duplicate room
      name: newRoomName,
      coordinates: newCoordinates,
      textCoordinates: [
        roomToDuplicate.textCoordinates[0] + offset,
        roomToDuplicate.textCoordinates[1] + offset,
      ], // Offset the text coordinates as well
    };
  
    console.log("Duplicating room:", newRoom);
  
    // Update the rooms list with the new duplicate room
    setMaps((prevMaps) =>
      prevMaps.map((map) => {
        if (map.id === selectedMapId) {
          return {
            ...map,
            rooms: [...map.rooms, newRoom],
          };
        }
        return map;
      })
    );
  };
  
  // Function to edit a room's details (e.g., name or coordinates)
  const editRoom = (roomId: string, updatedRoomData: Partial<Room>) => {
    setMaps((prevMaps) =>
      prevMaps.map((map) => {
        if (map.id === selectedMapId) {
          return {
            ...map,
            rooms: map.rooms.map((room) =>
              room.id === roomId
                ? { ...room, ...updatedRoomData }
                : room
            ),
          };
        }
        return map;
      })
    );
  };

  return (
    <MapsContext.Provider 
        value={{ 
            maps, 
            selectedMapId, 
            selectMap, 
            updateRoomCoordinates,
            updateTextCoordinates,
            addNewRoom, 
            removeRoom,
            editRoom,
            duplicateRoom,
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
