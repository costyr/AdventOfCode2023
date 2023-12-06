const util = require('./Util.js');

function ComputeWinFactor(aTime, aDistance) {

  let total = aTime.reduce((aTotal, aTime, aIndex) => {
    let winCount = 0;
    for (let j = 1; j < aTime; j++) {
      let dist = (aTime - j) * j;
      if (dist > aDistance[aIndex])
        winCount++;
    }

    return aTotal *= winCount;
  }, 1);

  return total;
}

function MergeArray(aArr) {
  return [aArr.reduce((aTotal, aElem) => {
    return aTotal * Math.pow(10, aElem.toString().split("").length) + aElem;
  }, 0)];
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

console.log(ComputeWinFactor(time, distance));

let time2 = MergeArray(time);
let dist2 = MergeArray(distance);

console.log(ComputeWinFactor(time2, dist2));