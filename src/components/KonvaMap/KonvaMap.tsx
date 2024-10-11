import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Rect, Group } from 'react-konva';
import useImage from 'use-image';
import mapDatabase from './mockDatabase';
import styles from './KonvaMap.module.css'; // Import the CSS module
import { KonvaEventObject } from 'konva/lib/Node'; // Import Konva's event object type

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

  // Store completed polygons as arrays of points (each polygon is an array of numbers)
  const [polygons, setPolygons] = useState<number[][]>([
    [100, 100, 150, 50, 200, 100], // Triangle
    [250, 100, 250, 150, 300, 150, 300, 100], // First Square
    [411.83134800121115, 481.59871237518956, 411.83134800121115, 531.5987123751895, 461.83134800121115, 531.5987123751895, 461.83134800121115, 481.59871237518956], // Second Square
  ]);

  // Store points for the polygon currently being drawn
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);

  // Toggle between draw mode and zoom/drag mode
  const [drawMode, setDrawMode] = useState(false);

  // Track if hovering over a polygon
  const [isHoveringPolygon, setIsHoveringPolygon] = useState(false);

  // Track if hovering over the first vertex
  const [isHoveringFirstVertex, setIsHoveringFirstVertex] = useState(false);

  // Track if hovering over any other vertex
  const [isHoveringOtherVertex, setIsHoveringOtherVertex] = useState(false);

  // Index of the selected polygon, or null if none is selected
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState<number | null>(null);

  // Get the current map image path from the mock database
  const mapImagePath = mapDatabase[currentMap];

  // Load the map image using useImage hook
  const [image] = useImage(mapImagePath);

  // Fixed map image dimensions
  const imageWidth = 1000;
  const imageHeight = 800;

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

  /**
   * Helper function to calculate the distance between two points.
   */
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.hypot(x2 - x1, y2 - y1); // Use Math.hypot for better readability
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
      const distance = calculateDistance(pointerPosition.x, pointerPosition.y, firstX, firstY);
      const closeThreshold = 10; // Close shape if close to the first point

      if (distance <= closeThreshold) {
        // Close the polygon
        const updatedPoints = [...newPoints];
        updatedPoints.splice(updatedPoints.length - 2, 2); // Remove duplicate closing points

        setPolygons((prevPolygons) => [...prevPolygons, updatedPoints]); // Add the new polygon to the list
        setCurrentPoints([]); // Reset points for the next polygon

        return;
      }
    }

    setCurrentPoints(newPoints); // Update the currentPoints with the new point
  };

  /**
   * Handle polygon selection.
   * Toggles the selection state of the polygon when clicked.
   */
  const handlePolygonClick = (index: number) => {
    if (selectedPolygonIndex === index) {
      setSelectedPolygonIndex(null); // Deselect if already selected
    } else {
      setSelectedPolygonIndex(index); // Select the clicked polygon
    }
  };

  /**
   * Toggle between drawing and zoom/drag mode.
   */
  const toggleDrawMode = () => {
    setDrawMode(!drawMode); // Toggle between modes
  };

  const handleGroupDragEnd = (index: number, e: KonvaEventObject<DragEvent>) => {

    const group = e.target;
    const deltaX = group.x();
    const deltaY = group.y();
    console.log("X: ", deltaX, "Y: ", deltaY)

    // Update polygon points with the new position
    setPolygons((prevPolygons) => {
      const newPolygons = [...prevPolygons];
      const points = newPolygons[index];
      console.log("Points before drag: ", points)

      const updatedPoints = points.map((point, idx) => (idx % 2 === 0 ? point + deltaX : point + deltaY));
      newPolygons[index] = updatedPoints;
      console.log("New Polygon points: ", newPolygons[index])
      return newPolygons;
    });

    // Reset group position to (0,0) to avoid compounding translations
    group.position({ x: 0, y: 0 });
  };
  
  
  
  const handleVertexDrag = (
    polygonIndex: number,
    pointIndex: number,
    e: KonvaEventObject<DragEvent>
  ) => {
    e.cancelBubble = true;
    const vertex = e.target;
  
    // Get new position of the vertex
    const newPosX = vertex.x();
    const newPosY = vertex.y();
    console.log("New pos X:", newPosX, "Y:", newPosY);
  
    // Create a deep copy of the polygons array to maintain immutability
    const newPolygons = polygons.map((polygon, idx) => 
      idx === polygonIndex ? [...polygon] : polygon
    );
  
    const points = newPolygons[polygonIndex];
    console.log("Points before drag:", points);
  
    // Update the point in the copied polygon points
    points[pointIndex] = newPosX;
    points[pointIndex + 1] = newPosY;
  
    console.log("New Polygon points:", points);
  
    // Update the state with the modified polygons
    setPolygons(newPolygons);
  
    // Logging the updated state after the asynchronous setState operation
    setPolygons((prevPolygons) => {
      console.log("Updated polygons state:", prevPolygons);
      return prevPolygons;
    });
  };
  
  
  
  


  return (
    <div ref={konvaMapRef} className={styles.konvaMap}>
      {/* Button to toggle between drawing and zoom/drag mode */}
      <button className={styles.toggleButton} onClick={toggleDrawMode}>
        {drawMode ? 'Disable Draw Mode' : 'Enable Draw Mode'}
      </button>

      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        draggable={!drawMode} // Enable dragging only when not in draw mode
        onWheel={handleWheel} // Zoom handler
        onMouseDown={handleMouseDown} // Add points for drawing
      >
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={imageWidth}
              height={imageHeight}
              x={150} // Initial position after centering
              y={imagePosition.y}
            />
          )}

          {/* Render existing polygons */}
          {polygons.map((points, index) => (
          <Group
            key={index}
            draggable={selectedPolygonIndex === index}
            onDragEnd={(e) => handleGroupDragEnd(index, e)}
            onClick={() => handlePolygonClick(index)}
            onMouseEnter={(e) => {
              e.target.getStage().container().style.cursor = 'pointer';
              setIsHoveringPolygon(true);
            }}
            onMouseLeave={(e) => {
              e.target.getStage().container().style.cursor = 'default';
              setIsHoveringPolygon(false);
            }}
          >
            <Line
              points={points}
              stroke={selectedPolygonIndex === index ? '#3E9CCB' : '#3E9CCB'}
              strokeWidth={selectedPolygonIndex === index ? 2 : 1}
              closed
              fill="rgba(243, 242, 255, 0.5)"
            />

            {/* Render vertices if this polygon is selected */}
            {selectedPolygonIndex === index &&
              points.map((point, idx) => {
                if (idx % 2 === 0 && points[idx + 1] !== undefined) {
                  return (
                    <Rect
                      key={idx}
                      x={point - 4}
                      y={points[idx + 1] - 4}
                      width={8}
                      height={8}
                      fill="white"
                      stroke="#3E9CCB"
                      strokeWidth={0.5}
                      draggable
                      onDragMove={(e) => {
                        handleVertexDrag(index, idx, e);
                      }}
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
                    x={point - 4} // Offset to center the rectangle
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