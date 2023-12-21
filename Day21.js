const util = require('./Util.js');
const matrix = require('./Matrix.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function PrintMap(aMap) {

  let mm = matrix.CreateMatrix(aMap);

  mm.Print("");
}

function FindStart(aMap) {
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) 
      if (aMap[i][j] == 'S')
        return [j, i];
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
      nn.push([-1, -1]);
  }
  return nn;
}

function FindMaxPos(aSteps, aStart, aMap) {
  let allPos = [ aStart ];

  for (let i = 0; i < aSteps; i++)
  {

    let newPos = [];
    for (let j = 0; j < allPos.length; j++) {

      let pos = allPos[j];
      let pp = FindNeighbourhood(pos[0], pos[1], 0, aMap[0].length - 1, 0, aMap.length - 1);

      for (let k = 0; k < pp.length; k++)
      {
        let oo = pp[k];

        if (oo[0] == -1)
          continue;

        let x = oo[0] % aMap[0].length;

        if (x < 0)
          x = x + aMap[0].length;

        let y = oo[1] % aMap.length;

        if (y < 0)
          y = y + aMap.length;

        if (aMap[y][x] != '#') {

          if (newPos.find((aElem)=>{ return aElem[0] == oo[0] && aElem[1] == oo[1]; }) == undefined)
            newPos.push(oo);
        }
      }
    }

    console.log(i + " " + newPos.length);

    allPos = newPos;
  }

  return allPos.length;
}

let map = util.MapInput("./Day21TestInput.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

PrintMap(map);

let start = FindStart(map);

console.log(FindMaxPos(26501365, start, map));
