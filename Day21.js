const util = require('./Util.js');
const matrix = require('./Matrix.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function PrintMap(aMap) {

  let mm = matrix.CreateMatrix(aMap);

  mm.Print("");
}

function PrintPlots(aPlots, aMap, aMinMax) {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = 0;

  if (aMinMax == undefined) {
    for (let i = 0; i < aPlots.length; i++) {
      minX = Math.min(minX, aPlots[i][0]);
      maxX = Math.max(maxX, aPlots[i][0]);
      minY = Math.min(minY, aPlots[i][1]);
      maxY = Math.max(maxY, aPlots[i][1]);
    }
  }
  else {
    minX = aMinMax[0];
    maxX = aMinMax[1];
    minY = aMinMax[2];
    maxY = aMinMax[3];
  }

  let width = maxX - minX;
  let height = maxY - minY;

  let mm = new matrix.Matrix(width + 1, height + 1, '.');

  for (let i = minY; i <= maxY; i++)
    for (let j = minX; j <= maxX; j++) {

     if (i >= minY && i <= maxY && j >= minX && j <= maxX) {
        let [x, y] = TranslateToMap([j, i], aMap);

        mm.SetValue(i - minY, j - minX, aMap[y][x]);
      }
    }

  for (let i = 0; i < aPlots.length; i++) {

    let x0 = aPlots[i][0];
    let y0 = aPlots[i][1];

    if (y0 >= minY && y0 <= maxY && x0 >= minX && x0 <= maxX) {

      let x = x0 - minX;
      let y = y0 - minY;

      mm.SetValue(y, x, 'O');
    }
  }

  return mm.ToString("");
}

function FindStart(aMap) {
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      if (aMap[i][j] == 'S')
        return [j, i];
}

function FindNeighbourhood(aX, aY, aMinMax) {
  let nn = [];
  for (let i = 0; i < kNeighbours.length; i++) {
    let x = aX + kNeighbours[i][0];
    let y = aY + kNeighbours[i][1];

    if (aMinMax == undefined)
      nn.push([x, y]);
    else if (x >= aMinMax[0] && x <= aMinMax[1] &&
      y >= aMinMax[2] && y <= aMinMax[3])
      nn.push([x, y]);
  }
  return nn;
}

function TranslateToMap(aCoord, aMap) {
  let x = aCoord[0] % aMap[0].length;

  if (x < 0)
    x = x + aMap[0].length;

  let y = aCoord[1] % aMap.length;

  if (y < 0)
    y = y + aMap.length;

  return [x, y];
}

function FindMaxPos(aSteps, aStart, aMap, aPart1) {
  let allPos = [aStart];

  for (let i = 0; i < aSteps; i++) {

    let newPos = [];
    for (let j = 0; j < allPos.length; j++) {

      let pos = allPos[j];
      let pp = FindNeighbourhood(pos[0], pos[1], aPart1 ? [0, aMap[0].length - 1, 0, aMap.length - 1] : undefined);

      for (let k = 0; k < pp.length; k++) {
        let oo = pp[k];

        let [x, y] = TranslateToMap(oo, aMap);

        if (aMap[y][x] != '#') {
          if (newPos.find((aElem) => { return aElem[0] == oo[0] && aElem[1] == oo[1]; }) == undefined)
            newPos.push(oo);
        }
      }
    }

    console.log(i + " " + newPos.length);

    allPos = newPos;
  }

  let queue = [[0, 10, 0, 10]];

  let visited = [];

  let tt = new Map();
  while(queue.length > 0) {

  let ff = queue.shift();

  visited.push(ff);

  let key = PrintPlots(allPos, aMap, ff);

  if (key.indexOf('O') == -1)
    continue;

  let cc = tt.get(key);

  if (cc === undefined)
    tt.set(key, 1);
  else
    tt.set(key, cc + 1);

  for (let i = 0; i < kNeighbours.length; i++)
  {
    let x = kNeighbours[i][0];
    let y = kNeighbours[i][1];

    let bb = [ ff[0] + 11 * x, ff[1] + 11 * x, ff[2] + 11 * y, ff[3] + 11 * y];

    if (visited.find(a => { return a[0] == bb[0] && a[1] == bb[1] && a[2] == bb[2] && a[3] == bb[3]; }) === undefined)
      queue.push(bb);
  }  

  }
 
  console.log(tt);

  //console.log(PrintPlots(allPos, aMap));


  return allPos.length;
}

let map = util.MapInput("./Day21TestInput.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

PrintMap(map);

let start = FindStart(map);

console.log(FindMaxPos(70, start, map, false));
