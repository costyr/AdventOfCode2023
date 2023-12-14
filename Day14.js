const util = require('./Util.js');
const matrix = require('./Matrix.js');

function FindRocks(aRocksMap) {

  let rocks = [];
  for (let y = 0; y < aRocksMap.length; y++)
    for (let x = 0; x < aRocksMap[y].length; x++)
      if (aRocksMap[y][x] == 'O')
        rocks.push([x, y]);

  return rocks;
}

function PrintMap(aRocksMap) {
  let mm = matrix.CreateMatrix(aRocksMap);

  mm.Print("");
}

function MoveRocks(aRocksMap, aDir, aNoCopy) {
  let map = aNoCopy ? aRocksMap : util.CopyObject(aRocksMap);

  
  for (;;) {

  let moved = false;
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[y].length; x++)
      if (map[y][x] == 'O')
      {
        if (aDir == 'N') {
          let y0 = y - 1;

          if (y0 >= 0 && map[y0][x] == '.')
          {
            map[y][x] = '.';
            map[y0][x] = 'O';
            moved = true;
          }
        } 
        else if (aDir == 'S')
        {
          let y1 = y + 1;

          if (y1 < map.length && map[y1][x] == '.')
          {
            map[y][x] = '.';
            map[y1][x] = 'O';
            moved = true;
          }
        }
        else if (aDir == 'W')
        {
          let x0 = x - 1;

          if (x0 >= 0 && map[y][x0] == '.')
          {
            map[y][x] = '.';
            map[y][x0] = 'O';
            moved = true;
          }
        }
        else if (aDir == 'E')
        {
          let x1 = x + 1;

          if (x1 < map[0].length && map[y][x1] == '.')
          {
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


function MoveCircle(aRocksMap) {
  let map = util.CopyObject(aRocksMap);

  let prev = 0;
  for(i = 0; i < 1000000000; i++) {
    MoveRocks(map, 'N', true);
    MoveRocks(map, 'W', true);
    MoveRocks(map, 'S', true);
    MoveRocks(map, 'E', true);

    let sum = CountLoad(map);

    console.log(i + " " + sum);

    //if (prev == sum)
    //  return sum;

    prev = sum;

    //PrintMap(map);
  }

  return 0;
}


function CountLoad(aRocksMap) {

  let sum = 0;
  for (let y = 0; y < aRocksMap.length; y++)
  for (let x = 0; x < aRocksMap[y].length; x++)
    if (aRocksMap[y][x] == 'O')
      sum += aRocksMap.length - y;
  
  return sum;
}

let rocksMap = util.MapInput("./Day14TestInput.txt", (aElem) => {
 
  return aElem.split("");

}, "\r\n");

console.log(rocksMap);

let nn = MoveRocks(rocksMap, 'N', false);

PrintMap(nn);

console.log(CountLoad(nn));

console.log(MoveCircle(rocksMap));

