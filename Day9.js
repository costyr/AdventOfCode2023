const util = require('./Util.js');

function ComputeDiffs(aNumbers) {
  let diffs = [];
  let count = 0;
  for (let i = 0; i < aNumbers.length - 1; i++) {
    let nn = aNumbers[i + 1] - aNumbers[i];
    if (nn == 0)
      count++;
    diffs.push(nn);
  }

  return { count: count, diffs: diffs };
}

function FindFirst(aNumbers) {
  let ret = ComputeDiffs(aNumbers);

  if (ret.count > 0 && (ret.count == ret.diffs.length))
    return aNumbers[aNumbers.length - 1];

  return aNumbers[0] - FindFirst(ret.diffs);
}

function FindLast(aNumbers) {
  let ret = ComputeDiffs(aNumbers);

  if (ret.count > 0 && (ret.count == ret.diffs.length))
    return aNumbers[aNumbers.length - 1];

  return aNumbers[aNumbers.length - 1] + FindLast(ret.diffs);
}

function ComputeSum(aAll) {
  return aAll.reduce((aTotal, aElem) => {
    return aTotal + FindLast(aElem);
  }, 0);
}

function ComputeSum2(aAll) {
  return aAll.reduce((aTotal, aElem) => {
    return aTotal + FindFirst(aElem);
  }, 0);
}

let ff = util.MapInput("./Day9Input.txt", (aElem) => {
  return aElem.split(" ").map((aElem) => { return parseInt(aElem); });
}, "\r\n");

console.log(ComputeSum(ff));
console.log(ComputeSum2(ff));
