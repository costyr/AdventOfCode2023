const util = require('./Util.js');
const matrix = require('./Matrix.js');


function MapPoint(aA, aMap) {
  for (let i = aA[0][0]; i <= aA[1][0]; i++)
    for (let j = aA[0][1]; j <= aA[1][1]; j++) {
      let key = i + "_" + j;

      let yy = aMap.get(key);

      if (yy === undefined)
        aMap.set(key, 1);
      else
        aMap.set(key, yy + 1);
    }
}

function IntersectsXY(aA, aB) {

  let ii = new Map();

  MapPoint(aA, ii);

  MapPoint(aB, ii);
  
  for (let [key, value] of ii)
    if (value > 1)
      return true;

  return false;
}

function IntersectsXYZ(aA, aB) {
  for (let x0 = aA[0][0]; x0 <= aA[1][0]; x0++)
    for (let y0 = aA[0][1]; y0 <= aA[1][1]; y0++)
       for (let z0 = aA[0][2]; z0 <= aA[1][2]; z0++)
         for (let x1 = aB[0][0]; x1 <= aB[1][0]; x1++)
           for (let y1 = aB[0][1]; y1 <= aB[1][1]; y1++)
            for (let z1 = aB[0][2]; z1 <= aB[1][2]; z1++)
              if (x0 == x1 && y0 == y1 && z0 == z1)
                return true;
  return false;
}

function MoveBrick(aBrickIndex, aBricks, aTestMove) {

  let brick = aBricks[aBrickIndex];

  brick[0][2]--;
  brick[1][2]--;

  if (brick[0][2] < 1) {
    brick[0][2]++;
    brick[1][2]++;
    return false;
  }

  let canMove = true;  
  for (let i = 0; i < aBricks.length; i++) {
    if (i == aBrickIndex)
      continue;

    if (IntersectsXYZ(brick, aBricks[i])) {
      canMove = false;
      break;
    }
  }

  if (canMove) {
    if (aTestMove) {
      brick[0][2]++;
      brick[1][2]++;
    }
    return true;
  }

  brick[0][2]++;
  brick[1][2]++;
  
  return false;
}

function MoveBricks(aBricks) {
  for (;;)
  {
    let moveCount = 0;
    for (let i = 0; i < aBricks.length; i++)
      if (MoveBrick(i, aBricks, false))
        moveCount++;

    if (moveCount == 0)
      break;
  }
}

function IsAbove(aA, aB) {
  return aA[0][2] > aB[0][2];
}

function CanRemove(aBrick, aIndex, aBricks) {
  for (let i = aIndex + 1; i < aBricks.length; i++)
  {
    let falls = true;
    for (let j = 0; j < aIndex; j++)
    {
      let brick0 = aBricks[j];
      let brick1 = aBricks[i];
      if (brick0[1][2] < brick1[0][2] && IntersectsXY(brick0, brick1))
      {
        falls = false;
        break;
      }
    }
    
    if (falls)
      return false;
  }

  return true;
}

function CountRemoveable(aBricks) {
  let count0 = 0; 
  let count = 0;
  for (let i = 0; i < aBricks.length; i++) {

    let uuu = util.CopyObject(aBricks);

    let bb = uuu.slice(0, i).concat(uuu.slice(i + 1));

    let moveCount = 0;
    for (let j = i; j < bb.length; j++)
      if (bb[j][0][2] > aBricks[i][1][2])
        if (MoveBrick(j, bb, false)) {
          moveCount++;
        }

    if (moveCount > 0) {
      count += moveCount;  
      console.log(i + " " + moveCount);
    }
    else 
      count0++;
  }

  return [count0, count];
}

let bricks = util.MapInput("./Day22Input.txt", (aElem) => {
  let pp = aElem.split("~");

  let ss = pp[0].split(",").map((aElem)=>{ return parseInt(aElem);});
  let ee = pp[1].split(",").map((aElem)=>{ return parseInt(aElem);});

  return [ss,ee];
}, "\r\n");

bricks.sort((a, b)=>{ 
  if (a[0][2] == b[0][2])
    return a[1][2] - b[1][2]
  return a[0][2] - b[0][2];
});

console.log(bricks);

MoveBricks(bricks);

console.log(bricks);

console.log(CountRemoveable(bricks));
