import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import { lineMP } from '../lineMP.mjs';

/**
 * Sets up the Three.js scene.
 * @returns {Object} An object containing the scene, camera, renderer, grid size, square size, and dark green color.
 */
function setupThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  const gridSize = 20;
  const squareSize = 1;
  const darkGreen = 0xb2c1a;
  return { scene, camera, renderer, gridSize, squareSize, darkGreen };
}

const { scene, camera, renderer, gridSize, squareSize, darkGreen } = setupThreeJS();
const squares = [];
const originalColors = [];

/**
 * Builds the initial chessboard.
 */
function buildBoard() {
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
      originalColors.push(material.color.clone());
    }
  }
}

buildBoard();

/**
 * Creates axis lines in the scene.
 * @param {THREE.Scene} scene - The Three.js scene.
 * @param {number} gridSize - The grid size.
 */
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

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/**
 * Animation function.
 */
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();

let firstCoorF = true;
let firstCoo = null;
let secCoo = null;

/**
 * Paints the selected square red.
 * @param {Object} coordinate - The coordinates of the square.
 */
function paintSmallSquare(coordinate) {
  const square = squares.find((obj) => obj.userData.coordinates.x === coordinate.x && obj.userData.coordinates.y === coordinate.y);
  if (square) {
    square.material.color.set(0xff0000);
  }
}

/**
 * Resets the chessboard.
 */
function resetBoard() {
  for (const tile of yellowTiles) {
    scene.remove(tile);
  }
  yellowTiles = [];
  for (const object of scene.children.slice()) {
    if (object instanceof THREE.Line && object.material.color.getHex() === 0x000000) {
      scene.remove(object);
    }
  }
  for (let i = 0; i < squares.length; i++) {
    squares[i].material.color.copy(originalColors[i]);
  }
  firstCoorF = true;
  firstCoo = null;
  secCoo = null;
}

/**
 * Disables camera controls to have a top view when the C key is pressed.
 */
function camToTopView() {
  const targetPosition = new THREE.Vector3(0, 0, 15);
  const targetLookAt = new THREE.Vector3(0, 0, 0);
  const animationDuration = 3000;
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

let yellowTiles = [];

/**
 * Renders yellow tiles on the chessboard.
 * @param {Array<Object>} segmentCoordinates - The coordinates of the segments.
 */
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

/**
 * Renders a black line connecting two coordinates.
 * @param {Object} coordinate1 - The first coordinate.
 * @param {Object} coordinate2 - The second coordinate.
 */
function renderExactLine(coordinate1, coordinate2) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(coordinate1.x * squareSize, coordinate1.y * squareSize, 0),
    new THREE.Vector3(coordinate2.x * squareSize, coordinate2.y * squareSize, 0),
  ]);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}

let closestSquare = null;
let closestCoordinates = null;
const impressoesDiv = document.querySelector('.impressoes');

window.addEventListener('mousemove', onMouseMove, false);

/**
 * Handles mouse move events.
 * @param {MouseEvent} event - The mouse move event.
 */
function onMouseMove(event) {
  const windowHeight = window.innerHeight;
  const mouseX = event.clientX;
  const mouseY = event.clientY - 17;
  const mouseCoordinates = `Mouse Coordinates (pixels): x = ${mouseX}, y = ${mouseY}`;
  impressoesDiv.innerHTML = mouseCoordinates;
  raycaster.setFromCamera(new THREE.Vector2((mouseX / window.innerWidth) * 2 - 1, -(mouseY / windowHeight) * 2 + 1), camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    let newClosestSquare = null;
    let newClosestDistance = Infinity;
    for (const intersect of intersects) {
      if (intersect.object.userData && intersect.object.userData.coordinates) {
        const coordinates = intersect.object.userData.coordinates;
        const distance = Math.abs(coordinates.x) + Math.abs(coordinates.y);
        if (distance < newClosestDistance) {
          newClosestSquare = intersect.object;
          newClosestDistance = distance;
        }
      }
    }
    if (newClosestSquare !== closestSquare) {
      closestSquare = newClosestSquare;
      closestCoordinates = closestSquare.userData.coordinates;
      console.log(`Square Coordinates: x = ${closestCoordinates.x}, y = ${closestCoordinates.y}`);
    }
    const squareCoordinates = `Square Coordinates: x = ${closestCoordinates.x}, y = ${closestCoordinates.y}`;
    impressoesDiv.innerHTML += `<br>${squareCoordinates}`;
  }
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyX' && closestCoordinates) {
    if (firstCoorF) {
      paintSmallSquare(closestCoordinates);
      firstCoo = closestCoordinates;
      firstCoorF = false;
    } else {
      paintSmallSquare(closestCoordinates);
      secCoo = closestCoordinates;
      renderExactLine(firstCoo, secCoo);
      const r = lineMP(firstCoo, secCoo);
      renderTiles(r);
      firstCoorF = true;
    }
  }
  if (event.code === 'Space') {
    resetBoard();
  }
  if (event.code === 'KeyC') {
    camToTopView();
  }
});