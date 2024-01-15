const util = require('./Util.js');
const matrix = require('./Matrix.js');
const dijkstra = require('./Dijkstra.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function PrintMap(aMap, aPath) {

  let uu = util.CopyObject(aMap);

  let mm = matrix.CreateMatrix(uu);

  if (aPath !== undefined) {
    for (let i = 0; i < aPath.length; i++)
      mm.SetValue(aPath[i][1], aPath[i][0], 'O');
  }

  mm.Print("");
}

function DFS(aNode, aLength, aMap, aVisited, aMax, aEndNodes, aDistMap, aPart1) {
  let x = aNode[0];
  let y = aNode[1];

  for (; ;) {

    let endReached = aEndNodes.find((aElem) => { return aElem[0] == x && aElem[1] == y; });

    if (endReached !== undefined) {

      let key = endReached[0] + "_" + endReached[1];

      aDistMap.set(key, aLength);

      if (aLength > aMax.max) {
        aMax.max = aLength;
        if (aPart1 !== undefined)
          console.log(endReached + ": " + aLength);
        //PrintMap(aMap, aVisited);
      }
      return;
    }

    if (aVisited.find((aElem) => { return aElem[0] == x && aElem[1] == y; }) === undefined)
      aVisited.push([x, y]);
    else
      return;

    if (aPart1 !== undefined) {
      let ss = aMap[y][x];
      if (ss == '>') {

        DFS([x + 1, y], aLength + 1, aMap, util.CopyObject(aVisited), aMax, aEndNodes, aDistMap, aPart1);
        return;
      }
      else if (ss == '<') {

        DFS([x - 1, y], aLength + 1, aMap, util.CopyObject(aVisited), aMax, aEndNodes, aDistMap, aPart1);
        return;
      }
      else if (ss == '^') {

        DFS([x, y - 1], aLength + 1, aMap, util.CopyObject(aVisited), aMax, aEndNodes, aDistMap, aPart1);
        return;
      }
      else if (ss == 'v') {
        DFS([x, y + 1], aLength + 1, aMap, util.CopyObject(aVisited), aMax, aEndNodes, aDistMap, aPart1);
        return;
      }
    }

    let pp = [];
    for (let i = 0; i < kNeighbours.length; i++) {
      let x1 = x + kNeighbours[i][0];
      let y1 = y + kNeighbours[i][1];

      if (x1 < 0 || x1 >= aMap[0].length ||
        y1 < 0 || y1 >= aMap.length ||
        (aVisited.find((aElem) => { return aElem[0] == x1 && aElem[1] == y1; }) !== undefined) ||
        (aMap[y1][x1] == '#'))
        continue;

      pp.push([x1, y1]);
    }

    if (pp.length == 1) {
      x = pp[0][0];
      y = pp[0][1];

      aLength++;
    }
    else {
      for (let i = 0; i < pp.length; i++) {

        DFS([pp[i][0], pp[i][1]], aLength + 1, aMap, util.CopyObject(aVisited), aMax, aEndNodes, aDistMap, aPart1);

      }
      return;
    }
  }
}

class SpecialGraph {
  constructor(aNodeMap) {
    this.mGraph = aNodeMap;
  }

  GetNeighbours(aNodeId, aPartPath) {

    let neighbours = [];

    let nn = this.mGraph.get(aNodeId);

    for (let [key, value] of nn) {

      neighbours.push({ id: key, cost: -1 * value });
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

function TopologicalSort(aNode, aVisited, aStack, aMap) {

  aVisited.push(aNode);

  let count = 0;
  let pp = [];
  for (let i = 0; i < kNeighbours.length; i++) {
    let x1 = aNode[0] + kNeighbours[i][0];
    let y1 = aNode[1] + kNeighbours[i][1];

    if (x1 < 0 || x1 >= aMap[0].length ||
      y1 < 0 || y1 >= aMap.length ||
      (aVisited.find((aElem) => { return aElem[0] == x1 && aElem[1] == y1; }) !== undefined) ||
      (aMap[y1][x1] == '#'))
      continue;

    count++;
    pp.push([x1, y1]);
  }

  if (count >= 2)
    console.log(aNode);

  for (let i = 0; i < pp.length; i++)
    TopologicalSort(pp[i], aVisited, aStack, aMap);



  aStack.push(aNode);
}

function FindGraphNodes(aMap) {

  let pp = [];

  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if (aMap[i][j] == '#')
        continue;

      let count = 0;
      for (let k = 0; k < kNeighbours.length; k++) {
        let x1 = j + kNeighbours[k][0];
        let y1 = i + kNeighbours[k][1];

        if (x1 < 0 || x1 >= aMap[0].length ||
          y1 < 0 || y1 >= aMap.length ||
          (aMap[y1][x1] == '#'))
          continue;

        count++;
      }

      if (count >= 3)
        pp.push([j, i]);
    }

  pp.push([1, 0]);
  pp.push([aMap[0].length - 2, aMap.length - 1]);

  let graph = new Map();
  for (let i = 0; i < pp.length; i++) {
    let total = { max: 0 };
    let distMap = new Map();
    let gg = util.CopyObject(pp);
    gg.splice(i, 1);
    DFS(pp[i], 0, aMap, [], total, gg, distMap);

    let key = pp[i][0] + "_" + pp[i][1];

    graph.set(key, distMap);
  }


  //console.log(graph);
  return graph;
}

function DFS2(aNode, aEnd, aLength, aGraphNodes, aVisited, aMax) {

  if (aNode == aEnd) {
    if (aLength > aMax.max) {
      aMax.max = aLength
      console.log(aLength);
    }
    return;
  }

  if (aVisited.indexOf(aNode) == -1)
    aVisited.push(aNode);
  else
    return;

  let children = aGraphNodes.get(aNode);

  for (let [key, value] of children) {
    if (aVisited.indexOf(key) >= 0)
      continue;

    DFS2(key, aEnd, aLength + value, aGraphNodes, util.CopyObject(aVisited), aMax);
  }
}

let map = util.MapInput("./Day23Input.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

console.log(map.length - 1, map[0].length - 1);

PrintMap(map);

let maxMap = new Map();

let total = { max: 0 };

DFS([1, 0], 0, map, [], total, [[map[0].length - 2, map.length -1]], maxMap, true);

console.log(total.max);

let graphNodes = FindGraphNodes(map);

console.log(graphNodes);

let end = (map[0].length - 2) + "_" + (map[0].length - 1);

DFS2("1_0", end, 0, graphNodes, [], { max: 0 });

/*let visited = [];
let stack = [];
TopologicalSort([1, 0], visited, stack, map);

let dist = new Map();

dist.set("1_0", 0);

while (stack.length > 0) {

  let cc = stack.pop();

  let x = cc[0];
  let y = cc[1];

  let key = x + "_" + y;

  let dd = dist.get(key);

  if (dd === undefined)
    continue;

  for (let i = 0; i < kNeighbours.length; i++) {
    let x1 = x + kNeighbours[i][0];
    let y1 = y + kNeighbours[i][1];

    if (x1 < 0 || x1 >= map[0].length ||
      y1 < 0 || y1 >= map.length ||
      (map[y1][x1] == '#'))
      continue;

    let key1 = x1 + "_" + y1;
    let dd1 = dist.get(key1);

    if (dd1 === undefined)
      dd1 = -Number.MAX_SAFE_INTEGER;

    if (dd1 < (dd + 1))
      dist.set(key1, dd + 1);
  }
}

//console.log(dist);

console.log(dist.get((map[0].length - 2) + "_" + (map[0].length - 1)));*/
