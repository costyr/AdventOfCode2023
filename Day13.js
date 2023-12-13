const util = require('./Util.js');

function ComputePatternSum(aPattern) {
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
      let l = y - 1;
      let p = y + 2;
      if ( l >= 0 && p < aPattern.length)
      for (;;)
      {
        for (let x = 0; x < aPattern[0].length; x++)
          if (aPattern[l][x] != aPattern[p][x])
          {
            found = false;
            break;
          }

        if (!found)
          break;

        l--;
        p++;

        if (l < 0 || p >= aPattern.length)
        {
          break;
        }  
      }

      if (found)
         return (y + 1) * 100 + (y + 2); 
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

      let l = x - 1;
      let p = x + 2;

      if ( l >= 0 && p < aPattern[0].length)
      for (;;)
      {
        for (let y = 0; y < aPattern.length; y++)
          if (aPattern[y][l] != aPattern[y][p])
          {
            found = false;
            break;
          }

        if (!found)
          break;

        l--;
        p++;

        if (l < 0 || p >= aPattern[0].length)
        {
          break;
        }  
      }

      if (found)
        return (x + 1) * 100 + (x + 2); 
    }
  }

  return 0;
}

function ComputeTotal(aPatternMaps) {
  let sum = 0;
  for (let i = 0; i < aPatternMaps.length; i++)
    sum += ComputePatternSum(aPatternMaps[i]);
  return sum;
}

let patternMaps = util.MapInput("./Day13Input.txt", (aElem) => {
 
  return aElem.split("\r\n").map((aElem) => { return aElem.split("");});

}, "\r\n\r\n");


console.log(patternMaps);

console.log(ComputeTotal(patternMaps));
