const util = require('./Util.js');

function ComputeWinFactor(aTime, aDistance) {

  let total = 1;
  for (let i = 0; i < aTime.length; i++)
  {
    let winCount = 0;
    for (let j = 1; j < aTime[i]; j++)
    {
      let dist = (aTime[i] - j) * j;
      if (dist > aDistance[i])
        winCount++; 
    }
    
    console.log(winCount);
    total *= winCount;
  }

  
  return total;
}

let time = [];
let distance = [];
util.MapInput("./Day6Input.txt", (aElem, aIndex) => {

  let values = aElem.split(" ").slice(1).map((aElem) => { 
    if (aElem == "") 
      return -1; 
    else 
      return parseInt(aElem); 
    }).filter((aElem) => { 
      return aElem != -1; 
    });

  if (aIndex == 0)
    time = values;
  else
    distance = values;

}, "\r\n");

console.log(time);
console.log(distance);

console.log(ComputeWinFactor(time, distance));

let time2 = [ 40929790];
let dist2 = [ 215106415051100];

console.log(ComputeWinFactor(time2, dist2));