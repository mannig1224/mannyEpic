import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import mapDatabase from './mockDatabase';
import styles from './KonvaMap.module.css'; // Import the CSS module
import { KonvaEventObject } from 'konva/lib/Node'; // Import Konva's event object type

interface KonvaMapProps {
  currentMap: string; // The current map name (to look up in the database)
}

const KonvaMap: React.FC<KonvaMapProps> = ({ currentMap }) => {
  const konvaMapRef = useRef<HTMLDivElement | null>(null); // Reference to the map container div
  const stageRef = useRef<typeof Stage>(null); // This will avoid the Konva namespace reference
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 800 }); // Track the size of the map container
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 }); // Track the position of the image (for centering)
  const [polygons, setPolygons] = useState<number[][][]>([]); // Store completed polygons as arrays of points
  const [currentPoints, setCurrentPoints] = useState<number[]>([]); // Store points for the polygon currently being drawn
  const [drawMode, setDrawMode] = useState(false); // Toggle between draw mode and zoom/drag mode
  const [isHoveringPolygon, setIsHoveringPolygon] = useState(false); // Track if hovering over a polygon
  const [imageCenterInitialized, setImageCenterInitialized] = useState(false); // Flag to ensure the image is centered once

  const mapImagePath = mapDatabase[currentMap]; // Get the current map image path from the mock database
  const [image] = useImage(mapImagePath); // Load the map image using useImage hook

  const imageWidth = 1000; // Fixed map image width
  const imageHeight = 800; // Fixed map image height

  /**
   * Center the image only once when the component first mounts and `containerSize` is ready.
   */
  useEffect(() => {
    if (!imageCenterInitialized && stageRef.current && image) {
      const x = (containerSize.width - imageWidth) / 2;
      const y = (containerSize.height - imageHeight) / 2;

      setImagePosition({ x, y }); // Center the image on the canvas
      setImageCenterInitialized(true); // Mark that the image has been centered
    }
  }, [imageCenterInitialized, containerSize, image, imageWidth, imageHeight]);

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
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
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
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    // Recalculate the position to keep zoom centered around the pointer
    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };

    // Apply new scale and position
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw(); // Redraw the stage
  };

  /**
   * Handle the end of polygon dragging.
   */
  const handleDragEnd = (index: number, e: KonvaEventObject<DragEvent>) => {
    const newPolygons = [...polygons];
    const newPoints = e.target.points();
    newPolygons[index] = newPoints.map((_, i) => (i % 2 === 0 ? [newPoints[i], newPoints[i + 1]] : [])).filter(Boolean);
    setPolygons(newPolygons);
  };

  /**
   * Handle adding points for drawing polygons.
   * Closes the shape if the last point is close enough to the first.
   */
  const handleMouseDown = (_: KonvaEventObject<MouseEvent>) => {
    if (!drawMode || isHoveringPolygon) return; // Only allow drawing in draw mode and if not hovering over an existing polygon

    const pointerPosition = getRelativePointerPosition();
    const firstX = currentPoints[0];
    const firstY = currentPoints[1];

    const newPoints = [...currentPoints, pointerPosition.x, pointerPosition.y];

    if (newPoints.length > 4) {
      const distance = calculateDistance(pointerPosition.x, pointerPosition.y, firstX, firstY);
      const closeThreshold = 10; // Close shape if close to the first point

      if (distance <= closeThreshold) {
        // Remove last point and save the polygon
        const updatedPoints = [...newPoints];
        updatedPoints.splice(updatedPoints.length - 2, 2); // Remove duplicate closing points
        setPolygons((prevPolygons) => [...prevPolygons, updatedPoints]);
        setCurrentPoints([]); // Reset points for the next polygon
        return;
      }
    }

    setCurrentPoints(newPoints); // Add new points while drawing
  };

  /**
   * Toggle between drawing and zoom/drag mode.
   */
  const toggleDrawMode = () => {
    setDrawMode(!drawMode); // Toggle between modes
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
              x={imagePosition.x} // Initial position after centering
              y={imagePosition.y}
            />
          )}

          {/* Render existing polygons */}
          {polygons.map((points, index) => (
            <React.Fragment key={index}>
              <Line
                points={points.flat()} // Flatten the 2D array to pass into the Line component
                stroke="#3E9CCB"
                strokeWidth={1}
                closed
                fill="rgba(243, 242, 255, 0.5)" // Semi-transparent fill
                draggable // Make the polygon draggable
                onDragEnd={(e) => handleDragEnd(index, e)} // Handle drag end event
                onMouseEnter={() => setIsHoveringPolygon(true)} // Track hover state
                onMouseLeave={() => setIsHoveringPolygon(false)} // Track hover state
              />
            </React.Fragment>
          ))}

          {/* Render the currently drawn polygon */}
          {currentPoints.length > 0 && (
            <>
              <Line points={currentPoints} stroke="#3E9CCB" strokeWidth={0.5} closed={false} />
              {/* Draw squares at each vertex */}
              {currentPoints.map((point, index) => (
                index % 2 === 0 &&
                currentPoints[index + 1] !== undefined && !isNaN(point) && !isNaN(currentPoints[index + 1]) ? (
                  <Rect
                    key={index}
                    x={point - 4}
                    y={currentPoints[index + 1] - 4}
                    width={8}
                    height={8}
                    fill="white"
                    stroke="#3E9CCB"
                    strokeWidth={1}
                  />
                ) : null
              ))}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaMap;
