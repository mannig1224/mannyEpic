import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Rect, Group, Text } from 'react-konva';
import useImage from 'use-image';
import styles from './KonvaMap.module.css'; // Import the CSS module
import { KonvaEventObject } from 'konva/lib/Node'; // Import Konva's event object type
import { useMaps } from '../../context/MapsContext';

interface KonvaMapProps {
  currentMap: string; // The current map name (to look up in the database)
}

const KonvaMap: React.FC<KonvaMapProps> = ({ currentMap }) => {
  // Reference to the map container div
  const konvaMapRef = useRef<HTMLDivElement | null>(null);

  // Reference to the Konva stage for controlling zoom/drag
  const stageRef = useRef<Konva.Stage | null>(null);

  // Track the size of the map container
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 800 });

  // Track the position of the image (for centering)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Store points for the polygon currently being drawn
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);

  

  // Track if hovering over a polygon
  const [isHoveringPolygon, setIsHoveringPolygon] = useState(false);

  // Track if hovering over the first vertex
  const [isHoveringFirstVertex, setIsHoveringFirstVertex] = useState(false);

  // Track if hovering over any other vertex
  const [isHoveringOtherVertex, setIsHoveringOtherVertex] = useState(false);

  // ID of the selected room, or null if none is selected
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Use MapsContext to get the selected map
  const { selectedMap, updateRoomCoordinates, addNewRoom, drawMode, toggleDrawMode } = useMaps();

  // Load the map image using the selected map's image path
  const [image] = useImage(selectedMap?.imagePath || '');

  // Fixed map image dimensions
  const imageWidth = 1200;
  const imageHeight = 1000;

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

  // Delete selected group when the Delete key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedRoomId !== null) {
        // Handle deletion logic, if required
        console.log(`Room with ID ${selectedRoomId} has been deleted.`);
        setSelectedRoomId(null); // Deselect after deleting
      }
    };

    // Attach event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedRoomId]);

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
        return;
      }
    }

    setCurrentPoints(newPoints); // Update the currentPoints with the new point
  };

  /**
   * Handle polygon selection.
   * Toggles the selection state of the polygon when clicked.
   */
  const handlePolygonClick = (roomId: string) => {
    if (selectedRoomId === roomId) {
      setSelectedRoomId(null); // Deselect if already selected
    } else {
      setSelectedRoomId(roomId); // Select the clicked polygon
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

      // Update the coordinates in the context
      updateRoomCoordinates(roomId, updatedPoints);
    }

    group.position({ x: 0, y: 0 });
  };

  const getPolygonCenter = (points: number[]) => {
    let sumX = 0;
    let sumY = 0;
    const numPoints = points.length / 2;

    for (let i = 0; i < points.length; i += 2) {
      sumX += points[i];
      sumY += points[i + 1];
    }

    return {
      x: sumX / numPoints,
      y: sumY / numPoints,
    };
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

  return (
    <div ref={konvaMapRef} className={styles.konvaMap}>
        {drawMode && (
          <div className={styles.tooltip}>
            Click on the map to start drawing your shape.
          </div>
        )}

      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        draggable={!drawMode}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
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
            />
          )}

          {/* Render existing polygons */}
          {selectedMap?.rooms.map((room) => (
            <Group
              key={room.id}
              draggable={selectedRoomId === room.id}
              onDragEnd={(e) => handleGroupDragEnd(room.id, e)}
              onClick={() => handlePolygonClick(room.id)}
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
                x={getPolygonCenter(room.coordinates).x}
                y={getPolygonCenter(room.coordinates).y}
                text={room.name}
                fontSize={12}
                fontFamily="Arial"
                fontStyle="bold"
                fill="black"
                align="center"
                verticalAlign="middle"
                offsetX={getTextWidth(room.name, 14, "Arial") / 3.5}
                offsetY={7}
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
                        onDragMove={(e) => {
                          const vertex = e.target;
                          const newPosX = vertex.x() + 4;
                          const newPosY = vertex.y() + 4;

                          const updatedCoordinates = [...room.coordinates];
                          updatedCoordinates[idx] = newPosX;
                          updatedCoordinates[idx + 1] = newPosY;

                          updateRoomCoordinates(room.id, updatedCoordinates);
                        }}
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
                    onMouseEnter={() => {
                      if (index === 0) {
                        setIsHoveringFirstVertex(true);
                      } else {
                        setIsHoveringOtherVertex(true);
                      }
                    }}
                    onMouseLeave={() => {
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
