const util = require('./Util.js');
const matrix = require('./Matrix.js');

function PrintMap(aMap) {
  let mm = matrix.CreateMatrix(aMap);
  mm.Print("");
}

function Energize(aStart, aMap) {
  let beams = [{ x: aStart.x, y: aStart.y, x0: aStart.x0, y0: aStart.y0 }];

  let visited = new Map();
  visited.set(aStart.x + "_" + aStart.y, [{ x0: aStart.x0, y0: aStart.y0 }]);
  for (;;) {
    let nb = [];
    for (let i = 0; i < beams.length; i++) {
      let beam = beams[i];

      if (beam.x < 0 || beam.x >= aMap[0].length ||
          beam.y < 0 || beam.y >= aMap.length)
        continue;

      let ss = aMap[beam.y][beam.x];

      if (ss == '.') {
        beam.x += beam.x0;
        beam.y += beam.y0;
      }
      else if (ss == '|') {
        if (beam.x0 != 0) {
          let nn = { x: beam.x, y: beam.y - 1, x0: 0, y0: -1 };
          if (nn.y >= 0)
            nb.push(nn);

          beam.y++;
          beam.x0 = 0;
          beam.y0 = 1;
        }
        else {
          beam.x += beam.x0;
          beam.y += beam.y0;
        }
      }
      else if (ss == '-') {
        if (beam.x0 != 0) {
          beam.x += beam.x0;
          beam.y += beam.y0;
        }
        else {
          let nn = { x: beam.x - 1, y: beam.y, x0: -1, y0: 0 };
          if (nn.x >= 0)
            nb.push(nn);

          beam.x++;
          beam.x0 = 1;
          beam.y0 = 0;
        }
      }
      else if (ss == '/') {
        if (beam.x0 != 0) {
          if (beam.x0 > 0) {
            beam.x0 = 0;
            beam.y0 = -1;
            beam.y--;
          }
          else {
            beam.x0 = 0;
            beam.y0 = 1;
            beam.y++;
          }
        }
        else {
          if (beam.y0 > 0) {
            beam.x0 = -1;
            beam.y0 = 0;
            beam.x--;
          }
          else {
            beam.x0 = 1;
            beam.y0 = 0;
            beam.x++;
          }
        }
      }
      else if (ss == '\\') {
        if (beam.x0 != 0) {
          if (beam.x0 > 0) {
            beam.x0 = 0;
            beam.y0 = 1;
            beam.y++;
          }
          else {
            beam.x0 = 0;
            beam.y0 = - 1;
            beam.y--;
          }
        }
        else {
          if (beam.y0 > 0) {
            beam.x0 = 1;
            beam.y0 = 0;
            beam.x++;
          }
          else {
            beam.x0 = -1;
            beam.y0 = 0;
            beam.x--;
          }
        }
      }
    }


    beams = beams.concat(nb);

    let count = 0;
    for (let i = 0; i < beams.length; i++) {
      let x = beams[i].x;
      let y = beams[i].y;

      if (x >= 0 && x < aMap[0].length &&
          y >= 0 && y < aMap.length) {
          count++;
          let key = x + "_" + y;
          let ii = visited.get(key);
          if (ii === undefined) {
            visited.set(key, [{ x0: beams[i].x0, y0: beams[i].y0 }]);
          }
          else {

            let hh = ii.find((aElem)=>{ return aElem.x0 == beams[i].x0 && aElem.y0 == beams[i].y0 });

            if (hh === undefined)
              ii.push({ x0: beams[i].x0, y0: beams[i].y0 });
            else {
              beams[i].x = -1;
              beams[i].y = -1;
            }
          }
      }
    }

    if (count == 0)
      break;
  }

  return visited.size;
}

function FindMaxEnergy(aMap) {
  
  let max = 0;

  for (let x = 0; x < aMap[0].length; x++)
  {
    let ee = Energize({x: x, y: 0, x0: 0, y0: 1}, aMap);

    if (ee > max)
      max = ee;
  }

  for (let x = 0; x < aMap[0].length; x++)
  {
    let ee = Energize({x: x, y: aMap.length - 1, x0: 0, y0: -1}, aMap);

    if (ee > max)
      max = ee;
  }

  for (let y = 0; y < aMap.length; y++)
  {
    let ee = Energize({x: 0, y: y, x0: 1, y0: 0}, aMap);

    if (ee > max)
      max = ee;
  }

  for (let y = 0; y < aMap.length; y++)
  {
    let ee = Energize({x: aMap[0].length - 1, y: y, x0: -1, y0: 0}, aMap);

    if (ee > max)
      max = ee;
  }

  return max;
}

let map = util.MapInput("./Day16Input.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

console.log(Energize({x: 0, y: 0, x0: 1, y0: 0}, map));

console.log(FindMaxEnergy(map));
