const util = require('./Util.js');

const values = [["one", "o1e"],
["two", "t2o"],
["three", "t3e"],
["four", "4"],
["five", "5e"],
["six", "6"],
["seven", "7n"],
["eight", "e8t"],
["nine", "n9e"]];

function IndexOfAll(array, searchItem) {
  var i = array.indexOf(searchItem),
    indexes = [];
  while (i !== -1) {
    indexes.push(i);
    i = array.indexOf(searchItem, ++i);
  }
  return indexes;
}

function ReplaceLiterals1(aElem) {
  console.log(aElem);
  let order = [];
  for (let i = 0; i < values.length; i++) {
    let ii = IndexOfAll(aElem, values[i][0]);

    if (ii.length > 0)
      for (j = 0; j < ii.length; j++)
        order.push([ii[j], i]);
    //console.log(ii);

  }

  order.sort((a, b) => { return a[0] - b[0]; });
  console.log(order);

  if (order.length > 0)
    aElem = aElem.replace(values[order[0][1]][0], values[order[0][1]][1]);

  if (order.length > 1) {

    let aa = aElem.replaceAll(values[order[order.length - 1][1]][0], values[order[order.length - 1][1]][1]);
    if (aa == aElem) {
      console.log(order);
      console.log("found: ", aa);
    }
    aElem = aa;
  }
  console.log(aElem);
  return aElem;
}

function ComputeCalibration(aLine) {
  let calibration = 0;
  if (aLine.length > 1)
    calibration = parseInt(aLine[0]) * 10 + parseInt(aLine[aLine.length - 1]);
  else
    calibration = parseInt(aLine[0]) * 10 + parseInt(aLine[0]);

  return calibration;
}

function ReplaceLiterals(aElem) {
  for (let i = 0; i < values.length; i++)
    aElem = aElem.replaceAll(values[i][0], values[i][1]);
  return aElem;
}

let total = 0;
let total2 = 0;

util.MapInput("./Day1Input.txt", (aElem) => {

  let line1 = aElem.split("").filter((a) => { return a >= '1' && a <= '9'; });

  let reduced = ReplaceLiterals(aElem);
  let line2 = reduced.split("").filter((a) => { return a >= '1' && a <= '9'; });

  let calibr = ComputeCalibration(line1);
  let calibr2 = ComputeCalibration(line2);

  total += calibr;
  total2 += calibr2;
}, "\r\n");

console.log(total);
console.log(total2);
