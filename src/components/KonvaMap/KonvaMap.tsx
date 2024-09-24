import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import mapDatabase from './mockDatabase';
import styles from './KonvaMap.module.css'; // Import the CSS module
import { KonvaEventObject } from 'konva/lib/Node'; // Import Konva's event object type

interface KonvaMapProps {
  currentMap: string; // The current map name (to look up in the database)
}

const KonvaMap: React.FC<KonvaMapProps> = ({ currentMap }) => {
  const konvaMapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<any>(null); // Reference to the stage for zooming
  const [containerSize, setContainerSize] = useState({ width: 800, height: 750 }); // Default size
  console.log("Container Size for the Stage: ", containerSize);
  const mapImagePath = mapDatabase[currentMap];
  const [image] = useImage(mapImagePath);

  const imageWidth = 800; // Set the image width
  const imageHeight = 600; // Set the image height

  // Update the size of the container based on its parent size
  useEffect(() => {
    const updateContainerSize = () => {
      if (konvaMapRef.current) {
        const { width, height } = konvaMapRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    };

    updateContainerSize(); // Initial size calculation
    window.addEventListener('resize', updateContainerSize); // Update on window resize

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []); // Runs once when the component mounts

  // Handle zoom functionality
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault(); // Prevent the default scroll behavior

    const stage = stageRef.current;
    const scaleBy = 1.05; // How fast you want the zoom to happen
    const oldScale = stage.scaleX();

    // Get mouse position relative to the stage
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    // Adjust scale based on wheel direction
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    // Adjust the position of the stage to zoom in/out from the mouse pointer
    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };
    stage.position(newPos);
    stage.batchDraw(); // Redraw the stage
  };

  return (
    <div ref={konvaMapRef} className={styles.konvaMap}>
      {/* Enable dragging and panning for the stage */}
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        draggable // Enable dragging the stage
        onWheel={handleWheel} // Enable zooming with the scroll wheel
      >
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={imageWidth}
              height={imageHeight}
              offsetX={imageWidth / 2}
              offsetY={imageHeight / 2}
              x={containerSize.width / 2}  // Center the image within the container
              y={containerSize.height / 2} // Center the image within the container
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaMap;
