const util = require('./Util.js');

function ComputeHash(aString) {
  return aString.reduce((aTotal, aElem) => {
    aTotal += aElem.charCodeAt(0);
    aTotal *= 17;
    aTotal %= 256;
    return aTotal
  }, 0)
};

function ComputeSum(aCodes) {

  let total = aCodes.reduce((aTotal, aElem) => {
    let sum = ComputeHash(aElem);
    console.log(sum);

    return aTotal + sum;
  }, 0);

  return total;
}

function ComputeFocusingPower(aCodes) {
  let boxes = [];

  for (let i = 0; i < aCodes.length; i++) {
    let cc = aCodes[i];
    let pos = cc.indexOf("=");
    if (pos >= 0) {
      let ll = cc.slice(0, pos);
      let boxIndex = ComputeHash(ll);
      let label = ll.toString().replaceAll(/,/g, "");
      let focalLength = parseInt(cc.slice(pos + 1));

      let box = boxes[boxIndex];

      if (box == undefined) {
        box = [];
        box.push({ l: label, f: focalLength });

        boxes[boxIndex] = box;
      }
      else {
        let pp = box.find((aElem) => { return aElem.l == label; });
        if (pp != undefined) {
          pp.f = focalLength;
        }
        else {
          box.push({ l: label, f: focalLength });
        }
      }
    }
    else {
      let pos2 = cc.indexOf("-");
      let ll = cc.slice(0, pos2);
      let label = ll.toString().replaceAll(/,/g, "");
      let boxIndex = ComputeHash(ll);

      let box = boxes[boxIndex];

      if (box != undefined) {
        let ii = box.find((aElem) => { return aElem.l == label });

        if (ii !== undefined)
          box.splice(box.indexOf(ii), 1);
      }
    }
  }

  let total = 0;
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];

    if (box !== undefined && box.length > 0) {
      for (let j = 0; j < box.length; j++) {
        let dd = (i + 1) * (j + 1) * box[j].f;

        total += dd;

        console.log(i + " " + j + " " + dd);
      }
    }
  }

  console.log(boxes);
  return total;
}

let codes = util.MapInput("./Day15Input.txt", (aElem) => {
  return aElem.split("");
}, ",");

console.log(codes);

console.log(ComputeSum(codes));

console.log(ComputeFocusingPower(codes));
