const util = require('./Util.js');
const matrix = require('./Matrix.js');

function ComputePatternSum(aPattern, aSkip) {
  for (let y = 0; y < aPattern.length - 1; y++)
  {
    let found = true;
    for (let x = 0; x < aPattern[y].length; x++)
      if (aPattern[y][x] != aPattern[y + 1][x])
      {
        found = false;
        break;
      }
    if (found)
    {
      let y0 = y - 1;
      let y1 = y + 2;
      let l = 0;
      if ( y0 >= 0 && y1 < aPattern.length)
      for (;;)
      {
        for (let x = 0; x < aPattern[0].length; x++)
          if (aPattern[y0][x] != aPattern[y1][x])
          {
            found = false;
            break;
          }

        if (!found)
          break;

        y0--;
        y1++;
        l++;

        if (y0 < 0 || y1 >= aPattern.length)
        {
          break;
        }  
      }

      if (found) {

        if (aSkip != undefined && aSkip[0] == 0 && aSkip[1] == y + 1)
          continue;
        else
          return [0, y + 1, l + 1]; 
      }
    }
  }

  for (let x = 0; x < aPattern[0].length - 1; x++)
  {
    let found = true;
    for (let y = 0; y < aPattern.length; y++)
      if (aPattern[y][x] != aPattern[y][x + 1])
      {
        found = false;
        break;
      }
    if (found) {

      let x0 = x - 1;
      let x1 = x + 2;
      let l = 0;
      if ( x0 >= 0 && x1 < aPattern[0].length)
      for (;;)
      {
        for (let y = 0; y < aPattern.length; y++)
          if (aPattern[y][x0] != aPattern[y][x1])
          {
            found = false;
            break;
          }

        if (!found)
          break;

        x0--;
        x1++;
        l++;

        if (x0 < 0 || x1 >= aPattern[0].length)
        {
          break;
        }  
      }

      if (found) {

        if (aSkip != undefined && aSkip[0] == x + 1 && aSkip[1] == 0)
          continue;
        else
          return [x + 1, 0, l + 1]; 
      }
    }
  }

  return [ 0, 0, 0 ];
}

function FindSmudge(aPattern) {

  let smudges = [];

  for (let y = 0; y < aPattern.length - 1; y++)
    for (let y1 = y + 1; y1 < aPattern.length; y1++)
    {
      let count = 0;
      let diff = [];
      for (let x = 0; x < aPattern[0].length; x++)
        if (aPattern[y][x] != aPattern[y1][x]) {
          count++;
          diff.push(x);
        }

      if (count == 1)
        smudges.push([diff[0], y1]);
    }

  for (let x = 0; x < aPattern[0].length - 1; x++)
    for (let x1 = x + 1; x1 < aPattern[0].length; x1++)
    {
      let count = 0;
      let diff = [];
      for (let y = 0; y < aPattern.length; y++)
        if (aPattern[y][x] != aPattern[y][x1]) {
          count++;
          diff.push(y);
        }

      if (count == 1)
        smudges.push([x1, diff[0]]);
    }

    return smudges;
}

function ComputeTotal(aPatternMaps) {
  let sum = 0;

  let mm = [];

  for (let i = 0; i < aPatternMaps.length; i++) {
    let rr = ComputePatternSum(aPatternMaps[i]);

    mm.push(rr);

    sum += rr[0] + rr[1] * 100;
  }
  return { sum: sum, m: mm };
}

function FindAllSmudges(aPatternMaps, aPrev) {

  let sum = 0;
  for (let i = 0; i < aPatternMaps.length; i++) {
    let rr = FindSmudge(aPatternMaps[i]);

    let max = 0;
    let oo = [0, 0, 0];
    let k = 0;
    for (let j = 0; j < rr.length; j++) {
      let x = rr[j][0];
      let y = rr[j][1];
      let map = util.CopyObject(aPatternMaps[i]);

      if (map[y][x] == '.')
        map[y][x] = '#'; 
      else
        map[y][x] = '.';
    
      let bb = ComputePatternSum(map, aPrev[i]);

      if (bb[2] > max)
      {
        oo = bb;
        max = bb[2];
        k = j;
      }
    }

    console.log("\n\n" + i + " [" + rr[k] + "] " + oo);

    let map2 = util.CopyObject(aPatternMaps[i]);
    map2[rr[k][1]][rr[k][0]] = 'X';

    let jj = matrix.CreateMatrix(map2);
    jj.Print("");

    sum += oo[0] + oo[1] * 100;
  }

  return sum;
}

let patternMaps = util.MapInput("./Day13Input.txt", (aElem) => {
 
  return aElem.split("\r\n").map((aElem) => { return aElem.split("");});

}, "\r\n\r\n");


//console.log(patternMaps);

let ret = ComputeTotal(patternMaps);

console.log(ret);

console.log(FindAllSmudges(patternMaps, ret.m));
