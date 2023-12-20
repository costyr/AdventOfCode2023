const util = require('./Util.js');
const matrix = require('./Matrix.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function ComputeWalls(aWalls) {

  let pt = { x: 0, y: 0 };
  let pp = [];
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let maxY = 0;
  let kk = new Map();
  for (let i = 0; i < aWalls.length; i++) {
    let ww = aWalls[i];

    let x0 = 0;
    let y0 = 0;
    if (ww.d == 'R') {
      x0 = 1;
      y0 = 0;
    }
    else if (ww.d == 'L') {
      x0 = -1;
      y0 = 0;
    }
    else if (ww.d == 'D') {
      x0 = 0;
      y0 = 1;
    }
    else {
      x0 = 0;
      y0 = -1;
    }

    for (let j = 0; j < ww.count; j++) {

      pt.x += x0;
      pt.y += y0;

      pp.push([pt.x, pt.y]);

      if (pt.x < minX)
        minX = pt.x;

      if (pt.y < minY)
        minY = pt.y;

      if (pt.x > maxX)
        maxX = pt.x;

      if (pt.y > maxY)
        maxY = pt.y;

      let yy = kk.get(pt.y);
      if (yy !== undefined) {
        if (pt.x < yy.min)
          yy.min = pt.x;

        if (pt.x > yy.max)
          yy.max = pt.x;
      }
      else {
        kk.set(pt.y, { min: pt.x, max: pt.x });
      }
    }
  }

  console.log(kk);
  console.log(minX + " " + maxX + ", " + minY + " " + maxY);

  let area = 0;
  let outer = [];
  for (let [key, value] of kk) {

    area += Math.abs(value.max - value.min) + 1;

    let hh = [];
    for (let j = 0; j < pp.length; j++)
      if (pp[j][1] == key)
        hh.push(pp[j][0]);

    hh.sort((a, b) => { return a - b; });

    let tt = [];
    for (let j = 0; j < hh.length - 1; j++) {
      let ooo = hh[j + 1] - hh[j] - 1;

      if (ooo > 0) {
        
          let isOuter = !IsInner(hh[j] + 1, key, minX, maxX, minY, maxY, pp, outer);

          if (isOuter) {
          area -= ooo;
          tt.push(ooo);
          }
      }
    }

    console.log((key - minY + 1) + ": [" + tt + "] " + hh);
  }

  PrintMap(minX, maxX, minY, maxY, pp);

  return area;
}

function FindNeighbourhood(aX, aY, aMinX, aMaxX, aMinY, aMaxY) {
  let nn = [];
  for (let i = 0; i < kNeighbours.length; i++) {
    let x = aX + kNeighbours[i][0];
    let y = aY + kNeighbours[i][1];

    if (x >= aMinX && x <= aMaxX &&
        y >= aMinY && y <= aMaxY)
      nn.push([x, y]);
    else
      nn.push([-10000, -10000]);
  }
  return nn;
}

function IsInner(aX, aY, aMinX, aMaxX, aMinY, aMaxY, aWallPoints, aOuterPoints) {

  let pt = aWallPoints.find((aElem) => { return aX == aElem[0] && aY == aElem[1]; });

  if (pt !== undefined)
    return true;

  let visited = [];
  let queue = [[aX, aY]];

  while (queue.length > 0) {
    let pos = queue.shift();
    let nn = FindNeighbourhood(pos[0], pos[1], aMinX, aMaxX, aMinY, aMaxY);

    for (let i = 0; i < nn.length; i++) {
      let vv = nn[i];
      if (vv[0] == -10000 && vv[1] == -10000)
        return false;
      else if (aOuterPoints.find((aElem) => { return aElem[0] == vv[0] && aElem[1] == vv[1]; }) !== undefined)
        return false;
      else if (visited.find((aElem) => { return aElem[0] == vv[0] && aElem[1] == vv[1]; }) === undefined &&
               aWallPoints.find((aElem) => { return aElem[0] == vv[0] && aElem[1] == vv[1]; }) === undefined) {
        if (queue.find((aElem) => { return aElem[0] == vv[0] && aElem[1] == vv[1]; }) === undefined)
          queue.push(vv);
      }
    }

    visited.push(pos);
  }

  console.log(aX + " " + aY + " " + (visited.length + aWallPoints.length));

  return true;
}

function PrintMap(aMinX, aMaxX, aMinY, aMaxY, aPoints) {

  let width = aMaxX - aMinX + 1;
  let height = aMaxY - aMinY + 1;

  let mm = new matrix.Matrix(width, height, '.');

  for (let i = 0; i < aPoints.length; i++) {
    let x = aPoints[i][0] - aMinX;
    let y = aPoints[i][1] - aMinY;

    mm.SetValue(y, x, '#');
  }

  mm.Print("");
}

function ComputeArea(aWalls) {

  let x = 1;
  let y = 1;

  let vertices = [];

  //vertices.push([0, 0]);

  for (let i = 0; i < aWalls.length; i++) {
    let ww = aWalls[i];

    if (ww.d == 'R') {
      x += ww.count;
    }
    else if (ww.d == 'L') {
      x -= ww.count;
    }
    else if (ww.d == 'D') {
      y += ww.count;
    }
    else {
      y -= ww.count;
    }

    vertices.push([x, y]);      
  }

  /*vertices.sort((a, b) => {
    if (a[1] == b[1])
      return a[0] - b[0];

    return a[1] - b[1];
  });*/

  let p1 = 0;
  let p2 = 0;
  let j = vertices.length - 1;
  for (let i = 0; i < vertices.length; i++)
  {
    /*let ll = vertices[i + 1][1] - vertices[i][1];

    let maxX = Math.max(vertices[i + 1][0], vertices[i][0]);
    
    let minX = Math.min(vertices[i + 1][0], vertices[i][0]);

    if (ll == 0)
      continue;

    let yy = Math.abs(ll + 1) * (Math.abs(maxX - minX) + 1);
    
    console.log(yy + " "  + vertices[i][1] + " " + vertices[i + 1][1] + " " + minX + " " + maxX);
    p1 += yy;*/   

    p1 += (vertices[j][0] + vertices[i][0]) * (vertices[j][1] - vertices[i][1]);
    j = i;
  }

  console.log(vertices);

  return p1 / 2;
}

let walls = util.MapInput("./Day18TestInput.txt", (aElem) => {
  let ww = aElem.split(" ");

  let cc = ww[2].substr(1, ww[2].length - 2);

  return { d: ww[0], count: parseInt(ww[1]), count2: parseInt(cc.substr(1, cc.length - 2), 16), d2:  parseInt(cc[cc.length - 1]) };
}, "\r\n");

console.log(walls);

//console.log(ComputeWalls(walls));

console.log(ComputeArea(walls));
