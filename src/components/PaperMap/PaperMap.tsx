import React, { useEffect, useRef } from 'react';
import styles from './PaperMap.module.css'; // Import the CSS module

const PaperMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('paper').then((paper) => {
        if (canvasRef.current) {
          // Initialize Paper.js with the canvas
          if (!paper.project || !paper.project.activeLayer) {
            console.log("Setting up Paper.js");
            paper.setup(canvasRef.current);
          }

          // Clear any previous drawings if the project exists
          if (paper.project) {
            paper.project.clear();
          }

          // Path to the workspace.png image in the public/images directory
          const mapImagePath = '/images/workspace.png';

          // Create an HTML Image object to ensure the image is fully loaded
          const img = new Image();
          img.src = mapImagePath;

          // When the image is loaded, we create the raster
          img.onload = () => {
            console.log("Image successfully loaded");

            // Now create the Paper.js Raster from the loaded img element
            const raster = new paper.Raster(img);

            // Fit the image to the canvas once it's loaded into Paper.js
            raster.fitBounds(paper.view.bounds);
          };

          // Handle image loading errors
          img.onerror = (err) => {
            console.error("Failed to load image", err);
          };

          // Cleanup previous raster images when the component unmounts or updates
          return () => {
            if (paper.project && paper.project.activeLayer.hasChildren()) {
              paper.project.activeLayer.removeChildren(); // Remove previous layers/raster images
            }
          };
        }
      });
    }
  }, []); // No dependencies, runs only once after component mounts

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default PaperMap;
