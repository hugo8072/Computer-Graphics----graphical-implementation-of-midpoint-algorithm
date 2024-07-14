We were initially asked to implement the general case of the midpoint algorithm for line generation. I started by adapting the algorithm provided on page 18 of the document “Chapter II: Raster Graphics Primitives”. The problem with this algorithm is that it could not create midpoints for cases where we wanted two points between different quadrants. Considering this, it would be necessary to make adaptations to the same algorithm using transformations for cases in different quadrants, which made the code much more complex and lengthy. I then realized that using Bresenham's algorithm, this problem did not occur, and considering that both algorithms have the same goal and do practically the same thing, I decided to proceed with Bresenham's algorithm due to its simplicity.

Index.html is an HTML code file that establishes the structure of the web page. It includes settings for encoding, compatibility, and viewport. The page has a black background, and a dark green title box in the top left corner stands out with the text "E-Fólio A - Computer Graphics - 2023/2024". There is also an import of an external script that will be executed after the page loads. This script, located in script.mjs, is the “brain” of the page.

Below is an explanation of each of the functions in “script.mjs”:

Function setupThreeJS:

Purpose: Set up the Three.js environment.
Creates a Three.js scene.
Sets up a perspective camera.
Initializes a WebGL renderer.
Defines initial parameters, such as board size and square size.
Returns an object containing these elements for later use.
Function buildBoard:

Purpose: Build the initial chessboard.
Uses loops to create alternately colored squares on the board.
Stores the original colors for later restoration.
The coordinates of the squares are saved so that they can be shown as “square coordinates” in the future, even when zooming in/out.
Function createAxesLines:

Purpose: Add axis lines to the scene.
Function animate:

Purpose: Create a continuous animation.
Uses recursion to continuously render the scene.
Function CamToTopView:

Purpose: Move the camera to a top view when pressing the "c" key.
Function renderTiles:

Purpose: Render yellow squares on the board.
Adds yellow squares to the scene based on the provided coordinates.
Function renderExactLine:

Purpose: Render a black line between two coordinates.
Creates material and geometry for the line.
Adds the line to the scene, connecting the provided coordinates.
Function onMouseMove:

Purpose: Update the mouse cursor coordinates and interact with objects in the scene.
Captures the mouse coordinates.
Uses raycasting to find objects intersected by the mouse ray.
Function resetBoard:

Purpose: Restore the board by removing additional elements.
Removes yellow squares.
Removes black lines.
Restores the original colors of the board squares.
Function paintSmallSquare:

Purpose: Paint a selected square red.
Finds the square based on the provided coordinates.
Sets the square's material color to red.
Function onKeyDown:

Purpose: Respond to keyboard events.
Description:
Pressing 'X' allows the user to select squares to later create lines between them.
Pressing the spacebar calls the resetBoard function to restore the board.
Pressing 'C' calls the CamToTopView function to move the camera to a top view.
Attached are videos of the project's execution (3) and also the execution of some test cases in “LineMP.mjs” (1 and 2).