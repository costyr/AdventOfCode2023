const util = require('./Util.js');
const matrix = require('./Matrix.js');

function PrintMap(aRocksMap) {
  let mm = matrix.CreateMatrix(aRocksMap);

  mm.Print("");
}

function MoveRocks(aRocksMap, aDir, aNoCopy) {
  let map = aNoCopy ? aRocksMap : util.CopyObject(aRocksMap);


  for (; ;) {

    let moved = false;
    for (let y = 0; y < map.length; y++)
      for (let x = 0; x < map[y].length; x++)
        if (map[y][x] == 'O') {
          if (aDir == 'N') {
            let y0 = y - 1;

            if (y0 >= 0 && map[y0][x] == '.') {
              map[y][x] = '.';
              map[y0][x] = 'O';
              moved = true;
            }
          }
          else if (aDir == 'S') {
            let y1 = y + 1;

            if (y1 < map.length && map[y1][x] == '.') {
              map[y][x] = '.';
              map[y1][x] = 'O';
              moved = true;
            }
          }
          else if (aDir == 'W') {
            let x0 = x - 1;

            if (x0 >= 0 && map[y][x0] == '.') {
              map[y][x] = '.';
              map[y][x0] = 'O';
              moved = true;
            }
          }
          else if (aDir == 'E') {
            let x1 = x + 1;

            if (x1 < map[0].length && map[y][x1] == '.') {
              map[y][x] = '.';
              map[y][x1] = 'O';
              moved = true;
            }
          }
        }


    if (!moved)
      break;
  }

  return map;
}


function SimulateNCircles(aCount, aRocksMap) {
  let map = util.CopyObject(aRocksMap);

  let ff = new Map();

  for (i = 0; i < aCount; i++) {
    MoveRocks(map, 'N', true);
    MoveRocks(map, 'W', true);
    MoveRocks(map, 'S', true);
    MoveRocks(map, 'E', true);

    let sum = CountLoad(map);

    let gg = ff.get(sum);

    if (gg === undefined)
      ff.set(sum, { prev0: i, prev: i, freq: [] });
    else {

      let nf = i - gg.prev;
      if (gg.freq.indexOf(nf) == -1)
        gg.freq.push(i - gg.prev);
      gg.prev0 = gg.prev;
      gg.prev = i;
    }
  }

  return ff;
}


function CountLoad(aRocksMap) {

  let sum = 0;
  for (let y = 0; y < aRocksMap.length; y++)
    for (let x = 0; x < aRocksMap[y].length; x++)
      if (aRocksMap[y][x] == 'O')
        sum += aRocksMap.length - y;

  return sum;
}

function FindBig(aCicleCount, aFreqMap) {

  let maxPrev = 0;
  let lastKey = 0;
  for (let [key, value] of aFreqMap) {
    if (value.freq.length == 0)
      continue;

    if ((aCicleCount - value.prev - 1) % value.freq == 0) {
      if (value.prev > maxPrev) {
        maxPrev = value.prev;
        lastKey = key;
      }
    }
  }

  return lastKey;
}

let rocksMap = util.MapInput("./Day14Input.txt", (aElem) => {

  return aElem.split("");

}, "\r\n");

let nn = MoveRocks(rocksMap, 'N', false);

let firstLoad = CountLoad(nn);

let freqMap = SimulateNCircles(1000, rocksMap);

console.log(freqMap);

console.log(firstLoad);
console.log(FindBig(1000000000, freqMap));
