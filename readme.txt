Project Overview
The project consists of two main parts:
1. Implementing the midpoint algorithm as a JavaScript module.
2. Building a three.js graphical interface that uses this module to draw segments on a 3D plane.
Part I - Midpoint Algorithm
Implementation Details
The `lineMP.mjs` module:
- Represents points as JavaScript object literals in the form `{x: int, y: int}`.
- Exports a function called `lineMP` that calculates the condition number of a matrix.
- The `lineMP` function takes two points as input and returns an array of points representing the line segment.
Usage Example
```javascript
import { lineMP } from './lineMP.mjs';

let P = {x: 0, y: 0};
let Q = {x: 3, y: 1};

let R = lineMP(P, Q);
console.log(R); // Output: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 1}, {x: 3, y: 1}]
```
Part II - Graphical Interface
Implementation Details
The graphical interface is built using three.js and includes the following features:
- A plane divided into colored squares representing a raster display.
- Visualization of positive x and y axes.
- Mouse interaction to detect and log the coordinates of the pixel under the cursor.
- Keyboard interaction to select pixels and draw line segments using the midpoint algorithm.
Usage Instructions
1. Ensure you have an HTTP server running to serve the files.
2. Open `index.html` in your browser.
3. Use the mouse to hover over the grid and press the "X" key to select start and end points.
4. Press the "C" key to move the camera to a top-down view.
5. Press the "Backspace" key to clear the grid.
Dependencies
The project relies on the following libraries:
- [three.js](https://unpkg.com/three@0.124.0/build/three.module.js)
- [OrbitControls](https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js)
