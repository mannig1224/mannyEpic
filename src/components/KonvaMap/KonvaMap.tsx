import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Rect, Group, Text } from 'react-konva';
import useImage from 'use-image';
import styles from './KonvaMap.module.css'; // Import the CSS module
import { KonvaEventObject } from 'konva/lib/Node'; // Import Konva's event object type
import { useMaps, Room } from '../../context/MapsContext';

interface KonvaMapProps {
  currentMap: string; // The current map name (to look up in the database)
}

const KonvaMap: React.FC<KonvaMapProps> = ({ currentMap }) => {
  
  const konvaMapRef = useRef<HTMLDivElement | null>(null); // Reference to the map container div
  const stageRef = useRef<Konva.Stage | null>(null); // Reference to the Konva stage for controlling zoom/drag
  const groupRefs = useRef(new Map());
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 800 }); // Track the size of the map container
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 }); // Track the position of the image (for centering)
  const [currentPoints, setCurrentPoints] = useState<number[]>([]); // Store points for the polygon currently being drawn
  const [isHoveringPolygon, setIsHoveringPolygon] = useState(false); // Track if hovering over a polygon
  const [isHoveringFirstVertex, setIsHoveringFirstVertex] = useState(false); // Track if hovering over the first vertex
  const [isHoveringOtherVertex, setIsHoveringOtherVertex] = useState(false); // Track if hovering over any other vertex
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // ID of the selected room, or null if none is selected
  const { selectedMap, updateRoomCoordinates, addNewRoom, drawMode, updateTextCoordinates } = useMaps(); // Use MapsContext to get the selected map
  const [image] = useImage(selectedMap?.imagePath || ''); // Load the map image using the selected map's image path
  const [hoveredVertexIndex, setHoveredVertexIndex] = useState<number | null>(null);
  const [hoveredVertexFromSelected, setHoveredVertexFromSelected] = useState<{ roomId: string; vertexIndex: number } | null>(null);
  // Fixed map image dimensions
  const imageWidth = 1200;
  const imageHeight = 1000;
   // Effect to turn off selected polygon when switching drawMode
   useEffect(() => {
    if (drawMode) {
      setSelectedRoomId(null); // Deselect any selected polygon when switching to draw mode
    } else {
      setCurrentPoints([])
    }
  }, [drawMode]);
    // Effect to handle the delete key event for deleting vertices in an existing polygon
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && hoveredVertexFromSelected) {
        const { roomId, vertexIndex } = hoveredVertexFromSelected;

        const room = selectedMap?.rooms.find((room) => room.id === roomId);
        if (room) {
          // Remove the vertex at vertexIndex and the next (since points are x, y pairs)
          const updatedCoordinates = [
            ...room.coordinates.slice(0, vertexIndex),
            ...room.coordinates.slice(vertexIndex + 2),
          ];

          updateRoomCoordinates(roomId, updatedCoordinates, room.textCoordinates); // Update context state
          setHoveredVertexIndex(null); // Reset hovered state after deletion
        }
      }
    };

    // Attach keydown event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hoveredVertexFromSelected, selectedMap, updateRoomCoordinates]);

    // Effect to handle the delete key event for deleting vertices while drawing
    useEffect(() => {
      
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Delete' && hoveredVertexIndex !== null) {
          // Create a new array without the hovered vertex (both x and y coordinates)
          const updatedPoints = [
            ...currentPoints.slice(0, hoveredVertexIndex),
            ...currentPoints.slice(hoveredVertexIndex + 2)
          ];
          setCurrentPoints(updatedPoints);
          setHoveredVertexIndex(null); // Reset after deletion
          setIsHoveringOtherVertex(false)
        }
      };
    
      // Attach keydown event listener
      window.addEventListener('keydown', handleKeyDown);
  
      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
}, [hoveredVertexIndex, currentPoints, setCurrentPoints]);


  // UseEffect to log changes in selectedMap.rooms
  useEffect(() => {
    if (selectedMap) {
      console.log("Selected map rooms updated:", selectedMap.rooms);
    }
  }, [selectedMap?.rooms]);

  /**
   * Update the container size whenever the window is resized.
   */
  useEffect(() => {
    const updateContainerSize = () => {
      if (konvaMapRef.current) {
        const { width, height } = konvaMapRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    };

    updateContainerSize(); // Set initial size
    window.addEventListener('resize', updateContainerSize); // Update size on window resize

    return () => {
      window.removeEventListener('resize', updateContainerSize); // Cleanup event listener
    };
  }, []);


  /**
   * Helper function to get the relative position of the mouse pointer after applying stage transformations.
   * This ensures accurate pointer position regardless of zoom or pan.
   */
  const getRelativePointerPosition = () => {
    const stage = stageRef.current;
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert(); // Invert the transformation matrix to get the original point
    const pos = stage.getPointerPosition(); // Get the pointer position in stage coordinates
    return transform.point(pos); // Return the transformed point
  };

  const distanceFromSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
  
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
  
    let xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handlePolygonEdgeClick = (e: KonvaEventObject<MouseEvent>, room: Room) => {
    const pointerPosition = getRelativePointerPosition();
    if (!pointerPosition) return;

    const { x, y } = pointerPosition;
    const coordinates = room.coordinates;

    let closestEdgeIndex = -1;
    let closestDistance = Number.MAX_SAFE_INTEGER;

    // Loop through the coordinates to find the nearest edge
    for (let i = 0; i < coordinates.length; i += 2) {
      const nextIndex = (i + 2) % coordinates.length;

      const x1 = coordinates[i];
      const y1 = coordinates[i + 1];
      const x2 = coordinates[nextIndex];
      const y2 = coordinates[nextIndex + 1];

      const distance = distanceFromSegment(x, y, x1, y1, x2, y2);
      if (distance < closestDistance && distance < 10.5) {
        closestDistance = distance;
        closestEdgeIndex = i;
      }
    }

    // If a close enough edge is found, add a new point
    if (closestEdgeIndex !== -1) {
      const nextIndex = (closestEdgeIndex + 2) % coordinates.length;

      const x1 = coordinates[closestEdgeIndex];
      const y1 = coordinates[closestEdgeIndex + 1];
      const x2 = coordinates[nextIndex];
      const y2 = coordinates[nextIndex + 1];

      // Calculate the midpoint of the selected edge
      const newX = (x1 + x2) / 2;
      const newY = (y1 + y2) / 2;

      // Insert the new point into the coordinates array
      const updatedCoordinates = [
        ...coordinates.slice(0, nextIndex),
        newX,
        newY,
        ...coordinates.slice(nextIndex),
      ];

      // Update the room coordinates with the new point added
      updateRoomCoordinates(room.id, updatedCoordinates, room.textCoordinates);
    }
  };


// Combining the logic for both clicking on the polygon and clicking near an edge
const handlePolygonClickOrEdge = (e: KonvaEventObject<MouseEvent>, room: Room) => {
  e.cancelBubble = true; // Prevent event from propagating to the Stage
  
  console.log("Polygon click or edge detection triggered.");

    // If the polygon is not currently selected, simply select it
    if (selectedRoomId !== room.id) {
      console.log("Polygon is not active. Activating the polygon.");
      handlePolygonClick(room.id); // Activate the polygon
      return; // Do not proceed further, just activate it
    }

  // First, determine if the click is near an edge using handlePolygonEdgeClick logic
  const stage = e.target.getStage();
  if (!stage) {
    console.log("Stage not found.");
    return;
  }

  // Calculate the pointer position relative to the transformations
  const pointerPosition = getRelativePointerPosition();
  if (!pointerPosition) {
    console.log("Pointer position not found.");
    return;
  }

  console.log("Pointer Position:", pointerPosition);

  const { x, y } = pointerPosition;
  const coordinates = room.coordinates;

  console.log("Room Coordinates:", coordinates);

  let closestEdgeIndex = -1;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  // Loop through the coordinates to find the nearest edge
  for (let i = 0; i < coordinates.length; i += 2) {
    const nextIndex = (i + 2) % coordinates.length;

    const x1 = coordinates[i];
    const y1 = coordinates[i + 1];
    const x2 = coordinates[nextIndex];
    const y2 = coordinates[nextIndex + 1];

    console.log(`Checking edge from (${x1}, ${y1}) to (${x2}, ${y2})`);

    const distance = distanceFromSegment(x, y, x1, y1, x2, y2);
    console.log(`Distance from point (${x}, ${y}) to edge (${x1}, ${y1}) -> (${x2}, ${y2}) is ${distance}`);

    if (distance < closestDistance && distance < 10.5) { // Threshold distance of 15 pixels
      closestDistance = distance;
      closestEdgeIndex = i;
      console.log(`Found closer edge at index ${i} with distance ${distance}`);
    }
  }

  if (closestEdgeIndex !== -1) {
    console.log("A close enough edge was found. Adding a new point...");
    handlePolygonEdgeClick(e, room);
  } else {
    console.log("No edge close enough. Handling as a normal polygon click.");
    handlePolygonClick(room.id);
  }
};


  /**
   * Handle zooming using the mouse wheel.
   * Adjusts the zoom level and repositions the stage to zoom in/out towards the mouse pointer.
   */
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault(); // Prevent the default scrolling behavior

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const scaleBy = 1.05; // Zoom factor
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy; // Adjust scale based on scroll direction

    // Get the position of the pointer relative to the current scale
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Recalculate the position to keep zoom centered around the pointer
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    // Apply new scale and position
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw(); // Redraw the stage
  };

  /**
   * Handle adding points for drawing polygons.
   * Closes the shape if the last point is close enough to the first.
   */
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {

    
    if (!drawMode || isHoveringPolygon || isHoveringOtherVertex) return; // Only allow drawing if not hovering over a polygon or vertex

    const pointerPosition = getRelativePointerPosition(); // Get the accurate pointer position
    const firstX = currentPoints[0];
    const firstY = currentPoints[1];

    const newPoints = [...currentPoints, pointerPosition.x, pointerPosition.y]; // Add the new point

    if (newPoints.length > 4) {
      // If there are at least two points
      const distance = Math.hypot(pointerPosition.x - firstX, pointerPosition.y - firstY);
      const closeThreshold = 10; // Close shape if close to the first point

      if (distance <= closeThreshold) {
        // Close the polygon
        const updatedPoints = [...newPoints];
        updatedPoints.splice(updatedPoints.length - 2, 2); // Remove duplicate closing points

        // Add the new room to the context by passing only the coordinates
        addNewRoom(updatedPoints);

        // Reset points for the next polygon
        setCurrentPoints([]);
        setHoveredVertexIndex(null);
        return;
      }
    }
    // Set the hoveredVertexIndex to the index of the newly added point
    setHoveredVertexIndex(newPoints.length - 2); // The X coordinate index of the newly added point
    setCurrentPoints(newPoints); // Update the currentPoints with the new point
  };

  /**
   * Handle polygon selection.
   * Toggles the selection state of the polygon when clicked.
   */
  const handlePolygonClick = (roomId: string) => {
    if (drawMode) return; // If draw mode is active, don't allow polygon selection
  
    if (selectedRoomId === roomId) {
      setSelectedRoomId(null); // Deselect if already selected
    } else {
      setSelectedRoomId(roomId); // Select the clicked polygon
  
      // Access the group reference for the selected room
      const group = groupRefs.current.get(roomId);
      if (group) {
        group.moveToTop(); // Bring the selected group to the front of the layer
        group.getLayer().batchDraw(); // Redraw the layer to reflect the change
      }
    }
  };

  /**
   * Handle group drag end event to update room coordinates.
   */
  const handleGroupDragEnd = (roomId: string, e: KonvaEventObject<DragEvent>) => {
    const group = e.target;

    const deltaX = group.x();
    const deltaY = group.y();

    const room = selectedMap?.rooms.find((room) => room.id === roomId);

    if (room) {
      const updatedPoints = room.coordinates.map((point, idx) =>
        idx % 2 === 0 ? point + deltaX : point + deltaY
      );

      // Update the text coordinates (centroid) by applying the same delta offset
      const updatedTextCoordinates = room.textCoordinates.map((point, idx) =>
        idx % 2 === 0 ? point + deltaX : point + deltaY
      );
      

      // Update the coordinates in the context
      updateRoomCoordinates(roomId, updatedPoints, updatedTextCoordinates);
    }


    group.position({ x: 0, y: 0 });
  };
    /**
     * Handle Text Drag End Event to update text coordinates.
     */
    const handleTextDragEnd = (roomId: string, e: KonvaEventObject<DragEvent>) => {
      const textNode = e.target;
      const newX = textNode.x();
      const newY = textNode.y();

      // Update the text coordinates in the context using the function from MapsContext
      updateTextCoordinates(roomId, [newX, newY]);
    };


  const getTextWidth = (text: string, fontSize: number = 16, fontFamily: string = "Arial") => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${fontSize}px ${fontFamily}`;
      return context.measureText(text).width;
    }
    return 0;
  };

  const handleVertexDragMove = (
    e: KonvaEventObject<DragEvent>,
    room: Room,
    idx: number
  ) => {
    const vertex = e.target;
  
    const newPosX = vertex.x() + 4;
    const newPosY = vertex.y() + 4;
  
    // Update the room coordinates
    const updatedCoordinates = [...room.coordinates];
    updatedCoordinates[idx] = newPosX;
    updatedCoordinates[idx + 1] = newPosY;
   
    const updatedTextCoordinates = [
      room.textCoordinates[0], 
      room.textCoordinates[1], 
    ];
  
    // Update the room with new coordinates and textCoordinates
    updateRoomCoordinates(room.id, updatedCoordinates, updatedTextCoordinates);
  };
  

  return (
    <div ref={konvaMapRef} className={styles.konvaMap}>
        {drawMode && (
        <div className={`${styles.tooltip} ${drawMode ? styles.visible : ''}`}>
        Draw on the map to create a shape
      </div>
      )}

      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        draggable
        onWheel={handleWheel}
        onMouseDown={(e) => {
          // If clicking outside of any shape (i.e., on the stage), deselect the polygon
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            setSelectedRoomId(null);
          }
          handleMouseDown(e); // Existing logic for adding points to a polygon
        }}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = drawMode ? 'crosshair' : 'default'; // Set to 'crosshair' for pen-like appearance when drawing
          }
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = 'default'; // Reset to default when leaving the stage
          }
        }}
      
      >
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={imageWidth}
              height={imageHeight}
              x={150}
              y={imagePosition.y}
              onClick={() => {
                // When clicking on the map image, deselect any selected polygons
                setSelectedRoomId(null);
              }}
            />
          )}

          {/* Render existing polygons */}
          {selectedMap?.rooms.map((room) => (
            <Group
              key={room.id}
              ref={(ref) => {
                if (ref) {
                  groupRefs.current.set(room.id, ref);
                }
              }}
              draggable={selectedRoomId === room.id}
              onDragEnd={(e) => handleGroupDragEnd(room.id, e)}
              onClick={(e) => {
                e.cancelBubble = true; // Prevent the event from propagating to the Stage
                handlePolygonClickOrEdge(e, room)
              }}
              onMouseEnter={(e) => {
                e.target.getStage().container().style.cursor = 'pointer';
                setIsHoveringPolygon(true);
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage().container();
                if (container) {
                  container.style.cursor = drawMode ? 'crosshair' : 'default'; // Set to 'crosshair' if draw mode is on, otherwise 'default'
                }
                setIsHoveringPolygon(false);
              }}
            >
              <Line
                points={room.coordinates}
                stroke={selectedRoomId === room.id ? '#3E9CCB' : '#3E9CCB'}
                strokeWidth={selectedRoomId === room.id ? 1.5 : 0.5}
                closed
                fill="rgba(243, 242, 255, 0.5)"
              />

              {/* Render the room name inside the polygon */}
              <Text
                x={room.textCoordinates?.[0] ?? 0} // Provide a fallback value of 0 if textCoordinates is undefined
                y={room.textCoordinates?.[1] ?? 0}
                draggable
                text={room.name}
                fontSize={12}
                fontFamily="Arial"
                fontStyle="bold"
                fill="black"
                align="center"
                verticalAlign="middle"
                offsetX={getTextWidth(room.name, 14, "Arial") / 3.5}
                offsetY={7}
                onDragStart={(e) => {
                  e.cancelBubble = true; // Stop propagation of the drag start event
                }}
                onDragMove={(e) => {
                  e.cancelBubble = true; // Stop propagation of the drag move event
                }}
                onDragEnd={(e) => {
                  e.cancelBubble = true; // Stop propagation of the drag end event
                  handleTextDragEnd(room.id, e);
                }}
              />

              {/* Render vertices if this polygon is selected */}
              {selectedRoomId === room.id &&
                room.coordinates.map((point, idx) => {
                  if (idx % 2 === 0 && room.coordinates[idx + 1] !== undefined) {
                    return (
                      <Rect
                        key={idx}
                        x={point - 4}
                        y={room.coordinates[idx + 1] - 4}
                        width={8}
                        height={8}
                        fill="rgba(255, 255, 255, 0.9)"
                        stroke="#3E9CCB"
                        strokeWidth={0.5}
                        draggable
                        onDragMove={(e) => handleVertexDragMove(e, room, idx)}
                        onMouseEnter={() => setHoveredVertexFromSelected({ roomId: room.id, vertexIndex: idx })}
                        onMouseLeave={() => setHoveredVertexFromSelected(null)}
                        onDragEnd={(e) => e.cancelBubble = true}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
            </Group>
          ))}

          {/* Render the currently drawn polygon */}
          {currentPoints.length > 0 && (
            <>
              <Line points={currentPoints} stroke="#3E9CCB" strokeWidth={0.5} closed={false} />
              {/* Draw squares at each vertex */}
              {currentPoints.map((point, index) =>
                index % 2 === 0 &&
                currentPoints[index + 1] !== undefined &&
                !isNaN(point) &&
                !isNaN(currentPoints[index + 1]) ? (
                  <Rect
                    key={index}
                    x={point - 4}
                    y={currentPoints[index + 1] - 4}
                    width={8}
                    height={8}
                    fill="white"
                    stroke="#3E9CCB"
                    strokeWidth={1}
                    onMouseOver={() => {
                      setHoveredVertexIndex(index);
                      if (index === 0) {
                        setIsHoveringFirstVertex(true);
                      } else {
                        setIsHoveringOtherVertex(true);
                      }
                    }}
                    onMouseOut={() => {
                      setHoveredVertexIndex(null);
                      if (index === 0) {
                        setIsHoveringFirstVertex(false);
                      } else {
                        setIsHoveringOtherVertex(false);
                      }
                    }}
                  />
                ) : null
              )}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaMap;
