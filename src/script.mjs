import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import { lineMP } from "../lineMP.mjs";

function setupThreeJS() {
  // Create a Three.js scene
  const scene = new THREE.Scene();

  // Set up the camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20);

  // Create a WebGL renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Define the size of the grid and individual squares
  const gridSize = 20;
  const squareSize = 1;
  const darkGreen = 0xb2c1a;

  return {
    scene,
    camera,
    renderer,
    gridSize,
    squareSize,
    darkGreen,
  };
}

// Setup the new Scene
const { scene, camera, renderer, gridSize, squareSize, darkGreen } = setupThreeJS();

// Array to store the grid squares
const squares = [];
const originalColors = []; // Store the original colors of the board... Important in order to get 
//the correct board after delete first lines.

// Function to build the initial chessboard
function buildBoard()
 {
  for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
    for (let y = -gridSize / 2; y <= gridSize / 2; y++) {
      const material = (x + y) % 2 === 0
        ? new THREE.MeshBasicMaterial({ color: darkGreen })
        : new THREE.MeshBasicMaterial({ color: 0x9f6f27 });

      const square = new THREE.Mesh(new THREE.BoxGeometry(squareSize, squareSize, 0), material);

      square.userData.coordinates = { x, y };

      square.position.set(x * squareSize, y * squareSize, 0);
      scene.add(square);
      squares.push(square);
      originalColors.push(material.color.clone()); // Store the original color
    }
  }
}

// Call this function to create the initial chessboard
buildBoard();

// Create axis lines
function createAxesLines(scene, gridSize) {
  const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

  const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3((gridSize / 2) + 0.5, 0, 0)]);
  const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, (gridSize / 2) + 0.5, 0)]);

  const xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
  const yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);

  scene.add(xAxisLine);
  scene.add(yAxisLine);
}
createAxesLines(scene, gridSize);







// Set up camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

// Set up a raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Animation function
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();

// Variables for tracking the user's selection
let firstCoorF = true;
let firstCoo = null;
let secCoo = null;

// Function to paint the selected square in red
function paintSmallSquare(coordinate) {
  const square = squares.find((obj) => obj.userData.coordinates.x === coordinate.x && obj.userData.coordinates.y === coordinate.y);
  if (square) {
    square.material.color.set(0xff0000); 
  }
}

// Function to reset the chessboard
function resetBoard() {
  // Remove the yellow tiles
  for (const tile of yellowTiles) {
    scene.remove(tile);
  }
  yellowTiles = [];

  // Remove black lines
  for (const object of scene.children.slice()) {
    if (object instanceof THREE.Line && object.material.color.getHex() === 0x000000) {
      scene.remove(object); // Remove the black line
    }
  }

  // Restore the original colors
  for (let i = 0; i < squares.length; i++) {
    squares[i].material.color.copy(originalColors[i]);
  }

  // Reset control variables
  firstCoorF = true;
  firstCoo = null;
  secCoo = null;
}

// Function to disable camera controls in order to have a top view when C is
function CamToTopView() {
  const targetPosition = new THREE.Vector3(0, 0, 15); // Position above the chessboard
  const targetLookAt = new THREE.Vector3(0, 0, 0); // Point to look at

  const animationDuration = 3000; // Animation duration in milliseconds (3 seconds)
  const cameraPosition = camera.position.clone();
  const cameraLookAt = camera.getWorldDirection(new THREE.Vector3()).clone();

  let startTime = null;

  function animateCamera(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const t = Math.min(1, elapsed / animationDuration);

    camera.position.lerpVectors(cameraPosition, targetPosition, t);
    camera.lookAt(targetLookAt);

    if (t < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      controls.enabled = true;
    }

    renderer.render(scene, camera);
  }

  controls.enabled = false;
  requestAnimationFrame(animateCamera);
}

// Array to store yellow tiles
let yellowTiles = [];

// Function to render yellow tiles on the chessboard
function renderTiles(segmentCoordinates) {
  const tileHeight = squareSize / 4;
  const tileColor = new THREE.Color(1, 1, 0);

  for (const coordinate of segmentCoordinates) {
    const tileGeometry = new THREE.BoxGeometry(squareSize, squareSize, tileHeight);
    const tileMaterial = new THREE.MeshBasicMaterial({
      color: tileColor,
      transparent: true,
      opacity: 0.5,
    });

    const tile = new THREE.Mesh(tileGeometry, tileMaterial);
    tile.position.set(coordinate.x * squareSize, coordinate.y * squareSize, tileHeight / 2);

    scene.add(tile);
    yellowTiles.push(tile);
  }
}

// Function to render a black line connecting two coordinates
function renderExactLine(coordinate1, coordinate2) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(coordinate1.x * squareSize, coordinate1.y * squareSize, 0),
    new THREE.Vector3(coordinate2.x * squareSize, coordinate2.y * squareSize, 0),
  ]);

  const line = new THREE.Line(lineGeometry, lineMaterial);

  scene.add(line);
}

// Variables to keep track of the closest square under the mouse cursor
let closestSquare = null;
let closestCoordinates = null;

// Get the DOM element for displaying mouse coordinates
const impressoesDiv = document.querySelector(".impressoes");

// Event listener for mouse movement
window.addEventListener('mousemove', onMouseMove, false);

// This function is responsible for handling mouse movement events.
function onMouseMove(event) {
  // Get the height of the window, and the current mouse coordinates.
  const windowHeight = window.innerHeight;
  const mouseX = event.clientX;
  const mouseY = event.clientY - 17; // Adjusting for an offset if needed.
  
  // Create a string with the mouse coordinates in pixels.
  const mouseCoordinates = `Mouse Coordinates (pixels): x = ${mouseX}, y = ${mouseY}`;

  // Display the mouse coordinates in an HTML element with the id "impressoesDiv".
  impressoesDiv.innerHTML = mouseCoordinates;

  // Create a raycaster to cast a ray from the mouse position into the 3D scene.
  raycaster.setFromCamera(new THREE.Vector2((mouseX / window.innerWidth) * 2 - 1, -(mouseY / windowHeight) * 2 + 1), camera);

  // Perform raycasting to find objects intersected by the ray.
  const intersects = raycaster.intersectObjects(scene.children, true);

  // If there are intersected objects:
  if (intersects.length > 0) {
    let newClosestSquare = null;
    let newClosestDistance = Infinity;

    // Iterate through the intersected objects.
    for (const intersect of intersects) {
      // Check if the intersected object has user data with coordinates.
      if (intersect.object.userData && intersect.object.userData.coordinates) {
        const coordinates = intersect.object.userData.coordinates;
        
        // Calculate the distance based on the coordinates.
        const distance = Math.abs(coordinates.x) + Math.abs(coordinates.y);

        // Update the closest square if a closer one is found.
        if (distance < newClosestDistance) {
          newClosestSquare = intersect.object;
          newClosestDistance = distance;
        }
      }
    }

    // If the closest square has changed, update and log the coordinates.
    if (newClosestSquare !== closestSquare) {
      closestSquare = newClosestSquare;
      closestCoordinates = closestSquare.userData.coordinates;
      console.log(`Square Coordinates: x = ${closestCoordinates.x}, y = ${closestCoordinates.y}`);
    }

    // Create a string with square coordinates.
    const squareCoordinates = `Square Coordinates: x = ${closestCoordinates.x}, y = ${closestCoordinates.y}`;
    // Display square coordinates 
    impressoesDiv.innerHTML += `<br>${squareCoordinates}`;
  }
}

// Event listener for keyboard input
window.addEventListener("keydown", (event) => {
  if (event.code === "KeyX" && closestCoordinates) {
    if (firstCoorF) {
      paintSmallSquare(closestCoordinates);
      firstCoo = closestCoordinates;
      firstCoorF = false;
    } else {
      paintSmallSquare(closestCoordinates);
      secCoo = closestCoordinates;
      renderExactLine(firstCoo, secCoo);
      let r = lineMP(firstCoo, secCoo);
      renderTiles(r);
      firstCoorF = true;
    }
  }

  if (event.code === "Space") {
    resetBoard();
  }

  if (event.code === "KeyC") {
    CamToTopView();
  }
});
