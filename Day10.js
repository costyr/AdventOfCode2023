const util = require('./Util.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const kDirMap = new Map();
kDirMap.set('-', [[-1, 0], [1, 0]]);
kDirMap.set('|', [[0, -1], [0, 1]]);
kDirMap.set('L', [[0, -1], [1, 0]]);
kDirMap.set('J', [[0, -1], [-1,0]]);
kDirMap.set('7', [[0, 1], [-1, 0]]);
kDirMap.set('F', [[0, 1],[1, 0]]);

function FindStart(aMap) {
  for (let y = 0; y < aMap.length; y++)
    for (let x = 0; x < aMap[y].length; x++)
      if (aMap[y][x] == 'S')
        return [x, y];
  return undefined;
}

function IsValidDirection(aPos, aDir, aMap) {
  let x = aDir[0];
  let y = aDir[1];
  
  let dir = aMap[y][x];

  if (dir == 'S')
    return true;

  let dirs = kDirMap.get(dir);
  for (let i = 0; i < dirs.length; i++)
  {
    let x1 = x + dirs[i][0];
    let y1 = y + dirs[i][1];
    if (x1 == aPos[0] && y1 == aPos[1]) {
      
      return true;
    }
  }
  
  return false;
}

function FindNeighbourhood(aPos, aMap) {
  let nn = [];
  for (let i = 0; i < kNeighbours.length; i++)
  {
    let x = aPos[0] + kNeighbours[i][0];
    let y = aPos[1] + kNeighbours[i][1];

    if (x >= 0 && x < aMap[0].length && 
        y >= 0 && y < aMap.length && 
        aMap[y][x] != '.')
      nn.push([x, y]);
  }
  return nn;
}

function FindNeighbourhood2(aPos, aMap) {
  let nn = [];
  for (let i = 0; i < kNeighbours.length; i++)
  {
    let x = aPos[0] + kNeighbours[i][0];
    let y = aPos[1] + kNeighbours[i][1];

    if (x >= 0 && x < aMap[0].length && 
        y >= 0 && y < aMap.length)
      nn.push([x, y]);
    else
      nn.push([-1, -1]);

  }
  return nn;
}

function FindLoop(aStart, aMap) {

  let pos = [aStart[0], aStart[1]];
  let path = [[aStart[0], aStart[1]]];
  let i = 0;
  let removeStart = false;
  for (;;) 
  {
    if (!removeStart && path.length > 2) {
      path.shift();
      removeStart = true;
    }
    let pp = FindNeighbourhood(pos, aMap);
    
    for (let i = 0; i < pp.length; i++)
    {
      let ee = path.find((aElem)=>{ 
        return aElem[0] == pp[i][0] && aElem[1] == pp[i][1];
      });
      if (IsValidDirection(pos, pp[i], aMap) && 
          IsValidDirection(pp[i], pos, aMap) && 
          ee === undefined)
      {
        pos = [pp[i][0], pp[i][1]];
        path.push(pos);
        break;
      }
    }

    i++;

    console.log(aMap[pos[1]][pos[0]] + " " + pos[0] + "," + pos[1] + " " + i);

    if (pos[0] == aStart[0] && 
        pos[1] == aStart[1])
      return { max: i / 2, path: path };
  }
}

function IsInLoop(aPos, aLoop, aMap) {
  let visited = [];
  let queue = [aPos];

  if (aLoop.find((aElem)=>{ return aElem[0] == aPos[0] && aElem[1] == aPos[1]; }) != undefined)
    return false;

  while(queue.length > 0)
  {
    let pos = queue.shift();
    let nn = FindNeighbourhood2(pos, aMap);

    for (let i = 0; i < nn.length; i++)
    {
      let vv = nn[i];
      if (vv[0] == -1 && vv[1] == -1)
        return false;
      else if (visited.find((aElem)=>{ return aElem[0] == vv[0] && aElem[1] == vv[1]; }) === undefined && 
               aLoop.find((aElem)=>{ return aElem[0] == vv[0] && aElem[1] == vv[1]; }) === undefined)
      {
        if (queue.find((aElem)=>{ return aElem[0] == vv[0] && aElem[1] == vv[1]; }) === undefined)
          queue.push(vv);
      }
    }

    visited.push(pos);
  }
  console.log(aPos);
  return true; 
}

function FindEnclosed(aLoop, aMap) {
  let count = 0;
  for (let y = 0; y < aMap.length; y++)
    for (let x = 0; x < aMap[y].length; x++)
      if (IsInLoop([x, y], aLoop, aMap))
        count++;

  return count;
}

let map = util.MapInput("./Day10TestInput4.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

console.log(map);

let start = FindStart(map);

console.log(start);

let loop = FindLoop(start, map);

console.log(loop.max);
console.log(loop.path);

console.log(FindEnclosed(loop.path, map));
