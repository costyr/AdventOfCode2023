const util = require('./Util.js');
const matrix = require('./Matrix.js');
const dijkstra = require('./Dijkstra.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function PrintMap(aMap) {
  let mm = matrix.CreateMatrix(aMap);
  mm.Print("");
}

function PrintPath(aMap, aPath) {
  let mm = util.CopyObject(aMap);

  for (let i = 0; i < aPath.length; i++)
  {
    let [x, y, dir, steps] = DecodeNode(aPath[i]);

    mm[y][x] = '_';
  }

  PrintMap(mm);
}
 
function IsValidPath(aX, aY, aPath) {
  let ff = 0;
  let bb = 0;
  let tt = 0;
  let pp = 0;
  let j = 1;
  for (let i = aPath.length - 1; i >= Math.max(aPath.length - 4, 0); i--, j++)
  {
    let yy = aPath[i].split("_");

    let x0 = parseInt(yy[0]);
    let y0 = parseInt(yy[1]);


    if (aX == x0 && aY == y0 + j)
      ff ++;
    else if (aX == x0 && aY == y0 - j)
      tt ++;
    else if (aX == x0 + j && aY == y0)
      bb ++;
    else if (aX == x0 - j && aY == y0)
      pp ++;
    else
      break;
  }

  if ((ff - 1) >= 3 || (bb - 1) >= 3 || 
      (tt - 1) >= 3 || (pp - 1) >= 3)
    return false;

  return true;
}

function DecodeNode(aNodeId) {
  return aNodeId.split("_").map((aElem)=>{ return parseInt(aElem); });
}

function EncodeNode(aX, aY, aDir, aSteps) {
  return aX + "_" + aY + "_" + aDir + "_" + aSteps;
}

class SpecialGraph {
  constructor(aNodeMap) {
    this.mGraph = aNodeMap;
    this.mVisited = new Map();
  }

  EndNodeReached(aCurrentNode, aEndNodeId) {

    let [x0, y0, dir0, steps0] = DecodeNode(aCurrentNode);

    let [x, y, dir, steps] = DecodeNode(aEndNodeId);

    if (x0 == x && y0 == y)
    {
      if (Math.abs(steps0) < 5 || Math.abs(steps0) > 10)
      return false;

      return true;
    }

    return false;
  }

  SetVisited(aState, aNode) {
    aState.SetVisited(aNode);
  }


  IsVisited(aState, aNode) {
    return aState.IsVisited(aNode);
  }

  GetNeighbours(aNodeId) {

    let [x0, y0, dir, steps] = DecodeNode(aNodeId);

    let neighbours = [];

    for (let i = 0; i < kNeighbours.length; i++) {

      let x = x0 + kNeighbours[i][0];
      let y = y0 + kNeighbours[i][1];

      if (x >= 0 && x < this.mGraph[0].length && 
          y >= 0 && y < this.mGraph.length)
      {
        let ff = y == y0 ? x - x0 : y - y0;
        let newDir = y == y0 ? 0 : 1;
        let newSteps = newDir == dir ? steps + ff: ff;

        if (Math.abs(newSteps) > 10) 
          continue;

       if ((newDir != dir) && (dir != -1) && (Math.abs(steps) < 4))
          continue;

        let newNode = EncodeNode(x, y, newDir, newSteps);
        
        neighbours.push({ id: newNode, cost: this.mGraph[y][x] });
      }
    }

    return neighbours;
  }
}

function FindShortesDist(aNodeMap, aStart, aEnd) {

  let graph = new SpecialGraph(aNodeMap);

  let dijsk = new dijkstra.Dijkstra(graph);

  let ret = dijsk.FindShortestPath(aStart, aEnd);
  return ret;
}

function DFS(aNode, aEnd, aLength, aMap, aPath, aMin) {
  let x = aNode[0];
  let y = aNode[1];

  if (x == aEnd[0] && y == aEnd[1])
  {
    if (aLength < aMin.min)
    {
      aMin.min = aLength;
      console.log(aLength);
      //PrintPath(aMap, aPath);
    }
    return;
  }

  if (aPath.find((aElem) => { return aElem[0] == x && aElem[1] == y; }) === undefined)
      aPath.push([x, y]);
    else
      return;

  if (aLength >= aMin.min) {
    //console.log(aLength + " " + aMin.min);
    return;
  }

  for (let i = 0; i < kNeighbours.length; i++) {
    let x1 = x + kNeighbours[i][0];
    let y1 = y + kNeighbours[i][1];
  
    if (x1 < 0 || x1 >= aMap[0].length ||
        y1 < 0 || y1 >= aMap.length ||
        (aPath.find((aElem)=>{ return aElem[0] == x1 && aElem[1] == y1;}) !== undefined) ||
        !IsValidPath(x1, y1, aPath))
      continue;
  
    DFS([x1, y1], aEnd, aLength + aMap[y1][x1], aMap, util.CopyObject(aPath), aMin);  
  }  
}

let map = util.MapInput("./Day17Input.txt", (aElem) => {
  return aElem.split("").map((aElem) => {return parseInt(aElem);});
}, "\r\n");

//PrintMap(map);

//console.log(map);
console.profile("abcd");
let end = EncodeNode(map[0].length - 1, map.length - 1, 0, 0);
let ret = FindShortesDist(map, EncodeNode(0, 0, -1, 0), end);

console.log(ret.dist);

//DFS([0, 0], [map[0].length - 1, map.length - 1], 0, map, [], { min: Number.MAX_VALUE });

PrintPath(map, ret.path);
console.profileEnd();
