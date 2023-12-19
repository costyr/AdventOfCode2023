const util = require('./Util.js');

function SimulateData2(aData, aInsts) {
  let mm = new Map();

  mm.set('x', aData[0]);
  mm.set('m', aData[1]);
  mm.set('a', aData[2]);
  mm.set('s', aData[3]);

  return SimulateData(mm, aInsts);
}

function SimulateData(aData, aInsts) {

  let next = "in";

  for (; ;) {

    if (next == 'A') {
      let sum = 0;
      for (let [key, value] of aData)
        sum += value;

      return sum;
    }
    else if (next == 'R')
      return 0;

    let rules = aInsts.get(next);

    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];

      if (rule.value0 === undefined) {
        next = rule.r;
        break;
      }
      else {
        let value0 = aData.get(rule.value0);

        let cond = rule.op == '>' ? (value0 > rule.value1) : (value0 < rule.value1);

        if (cond) {
          next = rule.r;
          break;
        }
      }
    }
  }
}

function ComputeSum(aData, aInsts) {
  let sum = 0;
  for (let i = 0; i < aData.length; i++)
    sum += SimulateData(aData[i], aInsts);

  return sum;
}

function CopyMap(aMap) {
  let newMap = new Map();
  for (let [key, value] of aMap)
    newMap.set(key, [value[0], value[1]]);
  return newMap;
}

function AcumulateIntervals(aTotal, aData) {

  aTotal.count++;

  for (let [key, value] of aData) {
    let oo = aTotal.map.get(key);

    for (let i = value[0]; i <= value[1]; i++) {
      let pp = oo.get(i);
      if (pp === undefined)
        oo.set(i, 1);
      else
        oo.set(i, pp + 1);
    }
  }
}

function ComputeAllCombs(aData) {

  let total = 1;
  for (let [key, value] of aData)
    total *= value[1] - value[0] + 1;
  return total;
}

function Simulate2(aNext, aData, aInsts, aTotal) {
  if (aNext == 'A') {

    aTotal.total += ComputeAllCombs(aData);

    return;
  }
  else if (aNext == 'R')
    return;

  let rules = aInsts.get(aNext);

  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i];

    if (rule.value0 === undefined) {
      Simulate2(rule.r, aData, aInsts, aTotal);
      break;
    }

    let mm = aData.get(rule.value0);

    if (rule.op == '<') {
      if (mm[0] <= rule.value1 && rule.value1 <= mm[1]) {
        let data = CopyMap(aData);

        data.set(rule.value0, [mm[0], rule.value1 - 1]);

        Simulate2(rule.r, data, aInsts, aTotal);

        aData.set(rule.value0, [rule.value1, mm[1]]);
      }
      else if (mm[1] < rule.value1) {
        let data = CopyMap(aData);

        Simulate2(rule.r, data, aInsts, aTotal);
      }
    }
    else {
      if (mm[0] <= rule.value1 && rule.value1 <= mm[1]) {

        aData.set(rule.value0, [mm[0], rule.value1]);

        let data = CopyMap(aData);

        data.set(rule.value0, [rule.value1 + 1, mm[1]]);

        Simulate2(rule.r, data, aInsts, aTotal);
      }
      else if (mm[0] > rule.value1) {
        let data = CopyMap(aData);

        Simulate2(rule.r, data, aInsts, aTotal);
      }
    }
  }
}

let insts = new Map();
let data = [];
util.MapInput("./Day19Input.txt", (aElem, aIndex) => {

  if (aIndex == 0) {
    aElem.split("\r\n").map((aElem) => {
      let uu = aElem.split("{");

      let ruleName = uu[0];

      let rules = uu[1].split(",").map((aElem) => {
        let rrr = aElem[aElem.length - 1] == '}' ? aElem.substr(0, aElem.length - 1) : aElem;

        let tt = rrr.split(":");

        if (tt.length == 1) {
          return { r: tt[0] };
        }
        else {
          return { value0: tt[0][0], op: tt[0][1], value1: parseInt(tt[0].substr(2)), r: tt[1] };
        }
      });

      insts.set(ruleName, rules);
    });
  }
  else {
    data = aElem.split("\r\n").map((aElem) => {
      let pp = new Map();
      aElem.split(",").map((aElem) => {
        let vv = aElem.split("=");

        let key = vv[0][0] == '{' ? vv[0].substr(1) : vv[0];
        let value = vv[1][vv[1].length - 1] == '}' ? vv[1].substr(0, vv[1].length - 1) : vv[1];

        pp.set(key, parseInt(value));
      });

      return pp;
    });
  }
}, "\r\n\r\n");

console.log(ComputeSum(data, insts));

let bigData = new Map();

bigData.set('x', [1, 4000]);
bigData.set('m', [1, 4000]);
bigData.set('a', [1, 4000]);
bigData.set('s', [1, 4000]);

let total = { total: 0 };

Simulate2("in", bigData, insts, total);

console.log(total.total);
