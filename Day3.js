const util = require('./Util.js');

const kNbt = [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]];
const kSymbols = ['$', '*', '+', '#', '-', '/', '=', '%', '@', '&'];

function IsDigit(aSymbol) {
  if (aSymbol >= '0' && aSymbol <= '9')
    return true;
  return false;
}

function PrintNbt(aMap, aPart) {
  let uu = "";
  for (let i = 0; i < aPart.coords.length; i++) {
    let x1 = aPart.coords[i][0];
    let y1 = aPart.coords[i][1];
    for (let k = 0; k < kNbt.length; k++) {
      let x = x1 + kNbt[k][0];
      let y = y1 + kNbt[k][1];

      if (x >= 0 && x < aMap[0].length &&
        y >= 0 && y < aMap.length &&
        !IsDigit(aMap[y][x]) &&
        aMap[y][x] != '.')
        uu += aMap[y][x];
    }
  }
  return uu;
}

function ComputeSum(aMap, aParts) {
  let sum = 0;

  let gearMap = new Map();

  for (let i = 0; i < aParts.length; i++) {
    let part = aParts[i];
    let found = false;
    //console.log(part.nr + " " + PrintNbt(aMap, part));
    for (let j = 0; j < part.coords.length; j++) {
      let x1 = part.coords[j][0];
      let y1 = part.coords[j][1];
      for (let k = 0; k < kNbt.length; k++) {
        let x = x1 + kNbt[k][0];
        let y = y1 + kNbt[k][1];

        if (x >= 0 && x < aMap[0].length &&
          y >= 0 && y < aMap.length &&
          kSymbols.indexOf(aMap[y][x]) >= 0) {
          found = true;
          if (aMap[y][x] == '*') {
            let gearId = x + "_" + y;
            let gearList = gearMap.get(gearId);
            if (gearList == undefined)
              gearMap.set(gearId, [part.nr]);
            else
              gearList.push(part.nr);
          }
          break;
        }

      }
      if (found)
        break;
    }
    if (found)
      sum += part.nr;
  }

  let gr = 0;
  for (let [key, value] of gearMap)
    if (value.length == 2)
      gr += value[0] * value[1];

  return { sum: sum, gr: gr };
}

function ParseParts(aMap) {

  let nn = [];
  let cc = { nr: 0, coords: [] };
  for (let i = 0; i < aMap.length; i++) {
    let isNumber = false;
    for (let j = 0; j < aMap[i].length; j++) {
      let ss = aMap[i][j];

      if (isNumber) {
        if (ss >= '0' && ss <= '9') {
          cc.nr = cc.nr * 10 + parseInt(ss);
          cc.coords.push([j, i]);
        }
        else {
          if (cc.coords.length > 0) {
            nn.push(util.CopyObject(cc));
            cc.nr = 0;
            cc.coords = [];
            isNumber = false;
          }
        }
      }
      else {
        if (ss >= '0' && ss <= '9') {
          isNumber = true;
          cc.nr = cc.nr * 10 ^ cc.coords.length + parseInt(ss);
          cc.coords.push([j, i]);
        }
      }
    }
    if (isNumber) {
      nn.push(util.CopyObject(cc));
      cc.nr = 0;
      cc.coords = [];
    }
  }
  return nn;
}

let map = util.MapInput("./Day3Input.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

let parts = ParseParts(map);
let sum = ComputeSum(map, parts);

console.log(sum.sum);
console.log(sum.gr);
