// UC: 21020 - Computação Gráfica (2023/24)
// 2100455 - Hugo Silva

/**
 * @param {{x: number; y: number}} S Starting coordinate
 * @param {{x: number; y: number}} F Ending coordinate
 * @returns An array of points representing the line from S to F
 */
export function lineMP(S, F) {
  let points = [];
  let dx = Math.abs(F.x - S.x);
  let dy = Math.abs(F.y - S.y);
  let sx = (S.x < F.x) ? 1 : -1;
  let sy = (S.y < F.y) ? 1 : -1;
  let err = dx - dy;

  while (S.x!=F.x || S.y !=F.y) {
    points.push({ x: S.x, y: S.y }); 
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; S.x += sx; }
    if (e2 < dx) { err += dx; S.y += sy; }
  }
  points.push({ x: S.x, y: S.y });
  return points;
}

/*let P = {x: 0, y: 0}; let Q = {x: 3, y: 1};
let R= lineMP(P,Q);
console.log(R);
 

Test case 1: From a point in the first quadrant (1, 2) to the second quadrant (3, 5)
const result1 = lineMP({ x: 1, y: 2 }, { x: 3, y: 5 });
console.log("Test Case 1:", result1);

// Test case 2: From a point in the first quadrant (2, 2) to the third quadrant (-3, -4)
const result2 = lineMP({ x: 2, y: 2 }, { x: -3, y: -4 });
console.log("Test Case 2:", result2);

// Test case 3: From a point in the first quadrant (4, 1) to the fourth quadrant (1, -3)
const result3 = lineMP({ x: 4, y: 1 }, { x: 1, y: -3 });
console.log("Test Case 3:", result3);

// Test case 4: From a point in the third quadrant (-2, -2) to the first quadrant (2, 2)
const result4 = lineMP({ x: -2, y: -2 }, { x: 2, y: 2 });
console.log("Test Case 4:", result4);

// Test case 5: From a point in the third quadrant (-4, 1) to the second quadrant (-1, 3)
const result5 = lineMP({ x: -4, y: 1 }, { x: -1, y: 3 });
console.log("Test Case 5:", result5);

// Test case 6: From a point in the third quadrant (-3, -3) to the fourth quadrant (3, -3)
const result6 = lineMP({ x: -3, y: -3 }, { x: 3, y: -3 });
console.log("Test Case 6:", result6);

// Test case 7: Points with the same ordinate (horizontal)
const result7 = lineMP({ x: 1, y: 2 }, { x: 4, y: 2 });
console.log("Test Case 7:", result7);

// Test case 8: Points with the same abscissa (vertical)
const result8 = lineMP({ x: 3, y: 1 }, { x: 3, y: 4 });
console.log("Test Case 8:", result8);

*/
