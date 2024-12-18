// geometryUtils.ts

/**
 * Calculates the shortest distance between a point (px, py) and a line segment defined by 
 * two endpoints (x1, y1) and (x2, y2).
 * 
 * The function works by projecting the point onto the line segment (if within bounds)
 * and finding the perpendicular distance to that projection. If the projection is outside 
 * the bounds of the line segment, the distance to the nearest endpoint is returned.
 *
 * Example:
 *  Suppose we have a line segment between (2, 2) and (8, 2) and we want to find the 
 *  distance from the point (5, 5) to this line segment. 
 * 
 *  - px = 5, py = 5  (Point coordinates)
 *  - x1 = 2, y1 = 2  (First endpoint of the line segment)
 *  - x2 = 8, y2 = 2  (Second endpoint of the line segment)
 *
 *  const distance = distanceFromSegment(5, 5, 2, 2, 8, 2);
 *  console.log(distance);  // Output: 3 (Distance from the point (5, 5) to the segment is 3)
 * 
 * @param px - The x-coordinate of the point.
 * @param py - The y-coordinate of the point.
 * @param x1 - The x-coordinate of the first endpoint of the line segment.
 * @param y1 - The y-coordinate of the first endpoint of the line segment.
 * @param x2 - The x-coordinate of the second endpoint of the line segment.
 * @param y2 - The y-coordinate of the second endpoint of the line segment.
 * 
 * @returns The shortest distance between the point (px, py) and the line segment.
 */
export const distanceFromSegment = (
    px: number, 
    py: number, 
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number
  ) => {
    
    // Calculate the vector components from point (x1, y1) to point (px, py)
    const A = px - x1;
    const B = py - y1;
    
    // Calculate the vector components of the line segment (x1, y1) to (x2, y2)
    const C = x2 - x1;
    const D = y2 - y1;
  
    // Calculate the dot product of vectors (A, B) and (C, D)
    const dot = A * C + B * D;
    
    // Calculate the length squared of the line segment (C^2 + D^2)
    const lenSq = C * C + D * D;
    
    // Initialize param to -1, which will later represent how far along the line segment the point projects
    let param = -1;
  
    // If the line segment has a length, calculate the projection factor
    if (lenSq !== 0) { 
      param = dot / lenSq; // Projection of the point on the line, scaled by the segment length
    }
  
    let xx, yy; // Coordinates for the point on the segment closest to the original point (px, py)
  
    // Determine if the projected point is outside the line segment:
    // If param < 0, the closest point is the starting point (x1, y1)
    if (param < 0) {
      xx = x1;
      yy = y1;
    } 
    // If param > 1, the closest point is the ending point (x2, y2)
    else if (param > 1) {
      xx = x2;
      yy = y2;
    } 
    // Otherwise, the closest point lies within the segment, so calculate its coordinates
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    // Calculate the distance between the point (px, py) and the closest point (xx, yy) on the line segment
    const dx = px - xx;
    const dy = py - yy;
  
    // Return the Euclidean distance
    return Math.sqrt(dx * dx + dy * dy);
  };
  