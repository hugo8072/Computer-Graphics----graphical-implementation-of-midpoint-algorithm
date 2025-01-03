/**
 * Bresenham's Algorithm for drawing a line between two points (S and F).
 * This algorithm is efficient for drawing straight lines between two points on a 2D plane.
 * The generated line is a sequence of points forming the approximate straight line, based on a series of incremental decisions.
 *
 * @param {{x: number; y: number}} startingPoint - The starting point of the line, with `x` and `y` coordinates.
 * @param {{x: number; y: number}} endPoint - The ending point of the line, with `x` and `y` coordinates.
 * @returns {Array<{x: number; y: number}>} An array containing the points that represent the line from start to finish.
 */
export function lineMP(startingPoint, endPoint) {
  let points = []; // Array to store the points of the line
  let dx = Math.abs(endPoint.x - startingPoint.x); // Absolute difference in x
  let dy = Math.abs(endPoint.y - startingPoint.y); // Absolute difference in y
  let sx = (startingPoint.x < endPoint.x) ? 1 : -1; // Determine the step direction for x
  let sy = (startingPoint.y < endPoint.y) ? 1 : -1; // Determine the step direction for y
  let error = dx - dy; // Initialize the error term

  // While the starting point hasn't reached the ending point
  while (startingPoint.x !== endPoint.x || startingPoint.y !== endPoint.y) {
    points.push({ x: startingPoint.x, y: startingPoint.y }); // Add the current point to the array
    let e2 = 2 * error; // Double the error to make it easier to adjust

    // Adjust the x coordinate if necessary
    if (e2 > -dy) {
      error -= dy;
      startingPoint.x += sx;
    }
    // Adjust the y coordinate if necessary
    if (e2 < dx) {
      error += dx;
      startingPoint.y += sy;
    }
  }

  // Add the final point to the array
  points.push({ x: startingPoint.x, y: startingPoint.y });

  return points; // Return the array of points that make up the line
}

/* Example test cases:
   Test Case 1: From point (1, 2) in the first quadrant to point (3, 5) in the second quadrant
   const result1 = lineMP({ x: 1, y: 2 }, { x: 3, y: 5 });
   console.log(result1);

   Test Case 2: From point (2, 2) in the first quadrant to point (-3, -4) in the third quadrant
   const result2 = lineMP({ x: 2, y: 2 }, { x: -3, y: -4 });
   console.log(result2);
*/

