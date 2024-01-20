const util = require('./Util.js');
const dijkstra = require('./Dijkstra.js');
const { randomInt } = require('crypto');

class SpecialGraph {
  constructor(aNodeMap) {
    this.mGraph = aNodeMap;
  }

  GetNeighbours(aNodeId, aPartPath) {

    let neighbours = [];

    let nn = this.mGraph.get(aNodeId);

    for (let i = 0; i < nn.length; i++) {

      neighbours.push({ id: nn[i], cost: 1 });
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

let connections = new Map();

function DFS(aNode, aLevel, aConnections, aVisited) {

  if (aVisited.indexOf(aNode) == -1) {
    aVisited.push(aNode);

    /*let line = "";
    for (let i = 0; i < aLevel; i++)
      line += "-";

    line += " " + aNode  
    console.log(line);*/
  }
  else
    return;

  let rr = aConnections.get(aNode);

  if (rr != undefined)
    for (let i = 0; i < rr.length; i++)
      DFS(rr[i], aLevel + 1, aConnections, aVisited);
}

function BFS(aNode, aLevel, aConnections, aVisited) {

  let queue = [{ node: aNode, level: aLevel }];
  while (queue.length > 0) {
    let nn = queue.shift();

    aVisited.push(nn.node);

    let line = "";
    for (let i = 0; i < nn.level; i++)
      line += "-";

    line += " " + nn.node;
    console.log(line);

    let rr = aConnections.get(nn.node);

    for (let i = 0; i < rr.length; i++) {

      if (aVisited.indexOf(rr[i]) == -1)
        queue.push({ node: rr[i], level: nn.level + 1 });
    }
  }
}

function FindRoot(aConnections) {
  for (let [key, value] of aConnections) {
    let found = true;
    for (let [key1, value1] of aConnections) {
      if (key1 == key)
        continue;

      for (let i = 0; i < value1.length; i++)
        if (value1[i] == key) {
          found = false;
          break;
        }

      if (!found)
        break;
    }

    if (found)
      return key;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function RemoveConnection(aNode1, aNode2, aConnections) {
  let children = aConnections.get(aNode1);

  if (children == undefined)
    return;

  let index = children.indexOf(aNode2);

  if (index >= 0)
    children.splice(index, 1);
}

function DisconnectWires(aWires, aConnections) {
  let newConnections = new Map(JSON.parse(JSON.stringify(Array.from(aConnections))));

  for (let i = 0; i < aWires.length; i++) {
    RemoveConnection(aWires[i][0], aWires[i][1], newConnections);

    RemoveConnection(aWires[i][1], aWires[i][0], newConnections);
  }

  return newConnections;
}

function FindGroups(aConnections) {
  let forestMap = new Map();

  for (let [key, value] of aConnections) {
    let vv = [];
    DFS(key, 0, aConnections, vv);

    vv.sort((a, b) => { return a.localeCompare(b); });

    console.log(vv.length);

    let key2 = vv.toString().replaceAll(/,/g, "_");

    forestMap.set(key2, vv);
  }

  console.log(forestMap);

  let total = 1;
  if (forestMap.size == 2) {
    for (let [key, value] of forestMap)
      total *= value.length;

    return total;
  }

  return 0;
}

function ContractGraph(aVertices, aNodes) {

  let verticesCopy = util.CopyObject(aVertices);

  while (verticesCopy.length > 1) {
    let index = getRandomInt(0, verticesCopy.length);

    let node1 = verticesCopy[index][0];
    let node2 = verticesCopy[index][1];

    let newNode = node1 + "_" + node2;

    verticesCopy.splice(index, 1);

    for (let i = 0; i < verticesCopy.length; i++) {
      if (verticesCopy[i][0] == node1 || verticesCopy[i][0] == node2)
        verticesCopy[i][0] = newNode;
      if (verticesCopy[i][1] == node1 || verticesCopy[i][1] == node2)
        verticesCopy[i][1] = newNode;
    }

    for (; ;) {
      let found = false;
      for (let i = 0; i < verticesCopy.length; i++) {
        for (let j = i + 1; j < verticesCopy.length; j++) {
          let v1 = verticesCopy[i];
          let v2 = verticesCopy[j];
          if ((v1[0] == v2[0] && v1[1] == v2[1]) ||
            (v1[0] == v2[1] && v1[1] == v2[0])) {
            found = true;
            verticesCopy.splice(j, 1);
            break;
          }
        }

        if (found)
          break;
      }

      if (!found)
        break;
    }
  }

  

  let cut1 = verticesCopy[0][0].split("_");
  let cut2 = verticesCopy[0][1].split("_");
  /*if (vertices.length == 3)
  {
    for (let i = 0; i < vertices.length; i++)
      cut.push([vertices[i][0].split("_")[0], vertices[i][1].split("_")[0]])

      console.log(cut);
  }*/

  return cut1.length * cut2.length;
}

function FindBridges(aConnections) {
  let pathMap = new Map();

  for (let i = 0; i < 1000; i++) {
    let start = getRandomInt(0, nodes.length);
    let end = getRandomInt(0, nodes.length);

    ret = FindShortesDist(aConnections, nodes[start], nodes[end]);

    for (let j = 0; j < ret.path.length - 1; j++)
    {
      let key = ret.path[j] + "_" + ret.path[j + 1];

      let ll = pathMap.get(key);

      if (ll === undefined)
        pathMap.set(key, 1);
      else
        pathMap.set(key, ll + 1);
    }

    console.log(ret);
  }

  let ff = Array.from(pathMap);

  ff.sort((a, b)=>{ return b[1] - a[1];});

  let vv = [];

  for (let i = 0; i < 3; i++)
    vv.push(ff[i][0].split("_"));

  console.log(vv);

  let nn = DisconnectWires(vv, connections);

  console.log(FindGroups(nn));
}

let vertices = [];
let nodes = [];

util.MapInput("./Day25Input.txt", (aElem) => {
  let rr = aElem.split(": ");
  let cc = rr[1].split(" ");

  for (let i = 0; i < cc.length; i++) {
    let yy = connections.get(cc[i]);
    if (yy === undefined)
      connections.set(cc[i], [rr[0]]);
    else {

      if (yy.indexOf(rr[0]) == -1)
        yy.push(rr[0]);
    }

    vertices.push([rr[0], cc[i]]);
    if (nodes.indexOf(cc[i]) == -1)
      nodes.push(cc[i]);
  }

  if (nodes.indexOf(rr[0]) == -1)
    nodes.push(rr[0]);

  let gg = connections.get(rr[0]);

  if (gg === undefined)
    connections.set(rr[0], cc);
  else {
    for (let i = 0; i < cc.length; i++)
      if (gg.indexOf(cc[i]) == -1)
        gg.push(cc[i]);
  }
}, "\r\n");

console.log(connections);

console.log(vertices.length, nodes.length);

nodes.sort((a, b) => { return a.localeCompare(b); });

console.log(nodes.toString());

for (let i = 0; i < vertices.length; i++)
  console.log(vertices[i][0] + " " + vertices[i][1]);

/*let nn = DisconnectWires([["hfx", "pzl"], ["bvb", "cmg"], ["nvd", "jqt"]], connections);

console.log(FindGroups(nn));*/

/*for (let i = 0; i < 1000000; i++) {
  let rr = ContractGraph(vertices, nodes);

  console.log(rr);

  if (rr.length == 3)
  {
    let nn = DisconnectWires(rr, connections);

    let tt = FindGroups(nn);

    if (tt > 0) {
      console.log(tt);
      break;
    }
  } 
}*/

FindBridges(connections);
