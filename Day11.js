const util = require('./Util.js');
const matrix = require('./Matrix.js');


function FindEmptyLines(aMap) {

  let lines = [];
  for (let y = 0; y < aMap.length; y++)
  {
    let count = 0;
    for (let x = 0; x < aMap[y].length; x++)  
      if (aMap[y][x] == '.')
        count++;
    
    if (count == aMap[y].length)
      lines.push(y);
  }

  return lines;
}

function FindEmptyColumns(aMap) {

  let columns = [];
  for (let x = 0; x < aMap[0].length; x++)
  {
    let count = 0;
    for (let y = 0; y < aMap[x].length; y++)  
      if (aMap[y][x] == '.')
        count++;
    
    if (count == aMap.length)
      columns.push(x);
  }

  return columns;
}

function FindGalaxies(aMap) {
  let galaxies = [];
  for (let y = 0; y < aMap.length; y++)
    for (let x = 0; x < aMap[y].length; x++)
      if (aMap[y][x] == '#')
        galaxies.push([x, y]);

  return galaxies;
}

function ExpandSpace(aGalaxies, aEmptyLines, aEmptyColumns, aExpand) {
  for (let i = 0; i < aEmptyLines.length; i++)
    for (let k = 0; k < aGalaxies.length; k++)
    {
      let hh = aGalaxies[k];

      if (hh[1] > aEmptyLines[i] + i * aExpand)
        hh[1] += aExpand;
    }

    for (let i = 0; i < aEmptyColumns.length; i++)
      for (let k = 0; k < aGalaxies.length; k++)
      {
        let hh = aGalaxies[k];
 
        if (hh[0] > aEmptyColumns[i] + i * aExpand)
          hh[0] += aExpand;
      }
}

function ComputeDist(aGalaxies) {
  let sum = 0;
  for (let i = 0; i < aGalaxies.length; i++)
    for (let j = i + 1; j < aGalaxies.length; j++)
    {
      let g1 = aGalaxies[i];
      let g2 = aGalaxies[j];
      let dist = Math.abs(g1[0] - g2[0]) + Math.abs(g1[1] - g2[1]);
      console.log((i + 1) + " " + (j + 1) + " : " + dist);
      sum += dist;
    }

  return sum;
}

let map = util.MapInput("./Day11Input.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

console.log(map);

let mm = matrix.CreateMatrix(map);

mm.Print("");

let ll = FindEmptyLines(map);
console.log(ll);

let cc = FindEmptyColumns(map);
console.log(cc);

let gg = FindGalaxies(map);
console.log(gg);

ExpandSpace(gg, ll, cc, 1000000 - 1);
console.log(gg);

console.log(ComputeDist(gg));
