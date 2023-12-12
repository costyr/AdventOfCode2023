const util = require('./Util.js');
const matrix = require('./Matrix.js');

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
  let oo = aMap[aPos[1]][aPos[0]];

  if (dir == '.')
    return false;

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

function FindEnclosed(aLoop, aMap, aEnclosed) {
  let count = 0;
  for (let y = 0; y < aMap.length; y++)
    for (let x = 0; x < aMap[y].length; x++)
      if (IsInLoop([x, y], aLoop, aMap)) {
        count++;
        aEnclosed.push([x, y]);
      }

  return count;
}

function PrintLoop(aLoop, aEnclosed, aMap) {
  let map = util.CopyObject(aMap);

  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[y].length; x++)
    {
      let ll = aLoop.find((aElem)=>{ return aElem[0] == x && aElem[1] == y; });
      if (ll === undefined) {
        map[y][x] = '.';
      let ee = aEnclosed.find((aElem)=>{ return aElem[0] == x && aElem[1] == y; });
      if (ee === undefined)
        map[y][x] = '0';
      else
        map[y][x] = 'X';
      }
    }

  let mm = matrix.CreateMatrix(map);
  mm.Print("");
  return map;
}

function InflateMap(aX, aY, aMap) {

  for (let y = 0; y < aMap.length; y++)
  {
    let ss = '.';
    if (IsValidDirection([aX, y], [aX + 1, y], aMap) && 
        IsValidDirection([aX + 1, y], [aX, y], aMap))
      ss = '-';

    aMap[y].splice(aX + 1, 0, ss);
  }

  let newLine = [];
  for (let x = 0; x < aMap[0].length; x++)
  {
    let ss = '.';
    if (IsValidDirection([x, aY], [x, aY + 1], aMap) && 
        IsValidDirection([x, aY + 1], [x, aY], aMap))
      ss = '|';

    newLine[x] = ss;
  }
  
  aMap.splice(aY + 1, 0, newLine);

  let mm = matrix.CreateMatrix(aMap);
  mm.Print("");
}

function DeflateMap(aX, aY, aMap) {
  for (let y = 0; y < aMap.length; y++)
    aMap[y].splice(aX, 1);
  
  aMap.splice(aY, 1);

  let mm = matrix.CreateMatrix(aMap);
  mm.Print("");      
}

let map = util.MapInput("./Day10Input.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

console.log(map);

let kk = Math.min(map.length, map[0].length);

for (let i = 0; i < kk - 1; i++)
  InflateMap(i + i, i + i, map);

let start = FindStart(map);

console.log(start);

let loop = FindLoop(start, map);

console.log(loop.max);
console.log(loop.path);

let enclosed = [];
console.log(FindEnclosed(loop.path, map, enclosed));

let oo = PrintLoop(loop.path, enclosed, map);

for (let i = 1; i < kk; i++)
  DeflateMap(i, i, oo);

let count = 0;
for (let y = 0; y < oo.length; y++)
  for (let x = 0; x < oo[y].length; x++)
    if (oo[y][x] == 'X')
      count ++;

console.log(count);
