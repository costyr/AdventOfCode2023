const util = require('./Util.js');

function CountTemplate(aComb) {

  let isSpring = false;
  let cc = [];
  let count = 0;
  for (let i = 0; i < aComb.length; i++)
    if (isSpring) {

      if (aComb[i] == '#')
        count++;
      else {
        isSpring = false;
        cc.push(count);
        count = 0;
      }
    }
    else {
      if (aComb[i] == '#') {
        count++;
        isSpring = true;
      }
    }

  if (isSpring)
    cc.push(count);

  return cc;
}

function MapCounts(aExpanded) {

  let countMap = new Map();
  for (let i = 0; i < aExpanded.length; i++) {
    let tt = CountTemplate(aExpanded[i]);

    let key = tt.toString();

    let cc = countMap.get(key);
    if (cc != undefined) {
      countMap.set(key, cc + 1);
    }
    else
      countMap.set(key, 1);
  }

  return countMap;
}

function GenerateAll(aTemplate, aIndex, aExpanded) {

  let count = 0;
  for (let i = aIndex; i < aTemplate.length; i++)
    if (aTemplate[i] == '?') {
      let t1 = aTemplate.slice();
      t1[i] = '#';
      GenerateAll(t1, i + 1, aExpanded);

      let t2 = aTemplate.slice();
      t2[i] = '.';
      GenerateAll(t2, i + 1, aExpanded);
      count++;
      break;
    }

  if (count == 0) {

    let existing = aExpanded.find((aElem) => {

      if (aElem.length != aTemplate.length)
        return false;

      for (let i = 0; i < aElem.length; i++)
        if (aElem[i] != aTemplate[i])
          return false;
      return true;
    });

    if (existing === undefined)
      aExpanded.push(aTemplate);
  }

  return;
}

function ComputeArrangements(aTemplate, aIndex, aIsSpring, aCount, aPattern, aTarget, aTotal) {

  if (aPattern.length > 0) {
    for (let j = 0; j < Math.min(aPattern.length, aTarget.length); j++)
      if (aPattern[j] != aTarget[j])
        return;
  }

  if (aPattern.length > aTarget.length)
    return;

  /*let remainingSprings = 0;
  for (let i = aPattern.length; i < aTarget.length; i++) {
    remainingSprings += aTarget[i];
    if (i < aTarget.length - 1)
      remainingSprings++;
  }

  if (aIsSpring)
    remainingSprings -= aCount;

  let remainingTemplate = aTemplate.length - aIndex + 1;

  if (remainingSprings > remainingTemplate)
    return;

  if ((aPattern.length < aTarget.length) && (aCount > aTarget[aPattern.length]))
    return;*/

  //console.log(aTemplate.slice(0, aIndex).toString().replaceAll(/,/g, "") + " " + aTemplate.slice(aIndex).toString().replaceAll(/,/g, "") + "    [" + aPattern + "] [" + aTarget + "]");

  //console.log(aTemplate.toString().replaceAll(/,/g, "") + " " + aPattern + " " + (aTemplate.length - aIndex));

  for (let i = aIndex; i < aTemplate.length; i++)
    if (aIsSpring) {
      if (aTemplate[i] == '?') {
        let t1 = aTemplate.slice();
        t1[i] = "#";
        ComputeArrangements(t1, i + 1, true, aCount + 1, aPattern.slice(), aTarget, aTotal);

        let t2 = aTemplate.slice();
        t2[i] = ".";
        let pattern = aPattern.slice();
        pattern.push(aCount);
        ComputeArrangements(t2, i + 1, false, 0, pattern, aTarget, aTotal);
        break;
      }
      else if (aTemplate[i] == '#') {
        aCount++;
      }
      else {
        aIsSpring = false;
        aPattern.push(aCount);
        aCount = 0;
      }
    }
    else {
      if (aTemplate[i] == '?') {
        let t1 = aTemplate.slice();
        t1[i] = "#";
        ComputeArrangements(t1, i + 1, true, 1, aPattern.slice(), aTarget, aTotal);

        let t2 = aTemplate.slice();
        t2[i] = ".";
        ComputeArrangements(t2, i + 1, false, 0, aPattern.slice(), aTarget, aTotal);
        break;
      }
      else if (aTemplate[i] == '#') {
        aCount++;
        aIsSpring = true;
      }
    }

  if (aTemplate.indexOf('?') > 0)
    return;

  if (aIsSpring)
    aPattern.push(aCount);

  if (aPattern.length != aTarget.length)
    return;

  for (let j = 0; j < aPattern.length; j++)
    if (aPattern[j] != aTarget[j])
      return;

  aTotal.total++;
}

function ComputeSum(aSpringMap) {

  let sum = 0;
  for (let i = 0; i < aSpringMap.length; i++) {
    let ee = [];
    GenerateAll(aSpringMap[i].t, 0, ee);

    let ssMap = MapCounts(ee);

    //console.log(ssMap);

    let key = aSpringMap[i].o.toString();

    let pp = ssMap.get(key);

    console.log(springMap[i].t + " " + springMap[i].o + " => " + pp);

    sum += pp;
  }

  return sum;
}

function ComputeSum1(aSpringMap) {
  let sum = 0;
  for (let i = 0; i < aSpringMap.length; i++) {

    let arangements = { total: 0}
    ComputeArrangements(aSpringMap[i].t.slice(), 0, false, 0, [], aSpringMap[i].o.slice(), arangements);

    console.log(aSpringMap[i].t.toString().replaceAll(/,/g, "") + " " + aSpringMap[i].o + " => " + arangements.total);

    sum += arangements.total;
  }

  return sum;
}

function ComputeSum2(aSpringMap) {

  let sum = 0;
  for (let i = 0; i < aSpringMap.length; i++) {

    let cache = new Map();
    let arrangementsCount = ComputeArrangements2(aSpringMap[i].t.slice(), 0, false, 0, aSpringMap[i].o.slice(), cache);

    console.log(aSpringMap[i].t.toString().replaceAll(/,/g, "") + " " + aSpringMap[i].o + " => " + arrangementsCount);

    sum += arrangementsCount;
  }

  return sum;
}

function ComputeSum3(aSpringMap) {

  let sum = 0;
  for (let i = 0; i < aSpringMap.length; i++) {

    let hh = [...aSpringMap[i].t, '?', ...aSpringMap[i].t, '?', ...aSpringMap[i].t, '?', ...aSpringMap[i].t, '?', ...aSpringMap[i].t].join("");

    let tt = [...aSpringMap[i].o, ...aSpringMap[i].o, ...aSpringMap[i].o, ...aSpringMap[i].o, ...aSpringMap[i].o];

    let cache = new Map();
    let arrangementsCount = ComputeArrangements2(hh.split(""), 0, false, 0, tt.slice(), cache);

    console.log(hh + " " + tt + " => " + arrangementsCount);

    sum += arrangementsCount;
  }

  return sum;
}

function ComputeArrangements2(aTemplate, aIndex, aIsSpring, aCount, aTarget, aCache) {

  if (!aIsSpring && aCount == 0 && aTarget.length > 0) {
    if (aIndex < aTemplate.length) {
      let key = aTemplate.slice(aIndex).toString().replaceAll(/,/g, "") + "_[" + aTarget + "]";
      let arrangementsCount = aCache.get(key);

      if (arrangementsCount !== undefined)
        return arrangementsCount;
    }
  }

  let sum = 0;

  for (let i = aIndex; i < aTemplate.length; i++)
    if (aIsSpring) {
      if (aTemplate[i] == '?') {

        if ((aCount + 1) <= aTarget[0]) {
          let t1 = aTemplate.slice();
          t1[i] = "#";
          sum += ComputeArrangements2(t1, i + 1, true, aCount + 1, aTarget.slice(), aCache);
        }

        if (aCount == aTarget[0]) {

          let t2 = aTemplate.slice();
          t2[i] = ".";

          let subTarget = aTarget.slice(1);

          let key = aTemplate.slice(i + 1).toString().replaceAll(/,/g, "") + "_[" + subTarget + "]";

          let arrangementsCount = ComputeArrangements2(t2, i + 1, false, 0, subTarget, aCache);

          if (aCache.get(key) === undefined)
            aCache.set(key, arrangementsCount);

          sum += arrangementsCount;
        }
        return sum;
      }
      else if (aTemplate[i] == '#') {
        aCount++;
      }
      else {
        if (aTarget.length > 0 && aCount == aTarget[0]) {
          aTarget.splice(0, 1);

          aIsSpring = false;
          aCount = 0;
        }
        else
          return sum;
      }
    }
    else {
      if (aTemplate[i] == '?') {
        let t1 = aTemplate.slice();
        t1[i] = "#";
        sum += ComputeArrangements2(t1, i + 1, true, 1, aTarget.slice(), aCache);

        let t2 = aTemplate.slice();
        t2[i] = ".";
        sum += ComputeArrangements2(t2, i + 1, false, 0, aTarget.slice(), aCache);
        return sum;
      }
      else if (aTemplate[i] == '#') {
        aCount++;
        aIsSpring = true;
      }
    }

  if (aIsSpring) {

    if (aTarget.length == 0)
      return sum;

    if (aCount == aTarget[0])
      aTarget.splice(0, 1);
    else
      return sum;
  }

  if (aTarget.length > 0)
    return sum;

  //console.log(aTemplate.slice(0, aIndex).toString().replaceAll(/,/g, "") + " " + aTemplate.slice(aIndex).toString().replaceAll(/,/g, "") + " [" + aTarget + "]");
  return sum + 1;
}

function ComputeBig2(aTemplate, aTarget) {
  let hh = [...aTemplate, '?', ...aTemplate, '?', ...aTemplate, '?', ...aTemplate, '?', ...aTemplate].join("");

  let tt = [...aTarget, ...aTarget, ...aTarget, ...aTarget, ...aTarget];
  let cache = new Map();
  let rr = ComputeArrangements2(hh.split(""), 0, false, 0, tt, cache);

  //console.log(rr, cache);

  return rr;
}

function ComputeSmall(aTemplate, aTarget) {
  let cache = new Map();
  let rr = { total: 0 };
  let kk = ComputeArrangements2(aTemplate.split(""), 0, false, 0, aTarget, rr, cache);

  console.log(rr, cache);
  return kk;
}

let springMap = util.MapInput("./Day12Input.txt", (aElem) => {
  let line = aElem.split(" ");

  return { t: line[0].split(""), o: line[1].split(",").map((aElem) => { return parseInt(aElem); }) };

}, "\r\n");

//console.log(springMap);

console.log(ComputeSum3(springMap));

let pp = "?###????????"; // 3,2,1 10
let pp1 = ".??..??...?##."; // 1,1,3
let pp2 = "?????????##?????"; // 1,9,1 20
let pp3 = ".??.??.???."; // 1,3
let pp4 = "???#???.???#?"; // 2,1,1,2
let pp5 = "?????????#???.#.?"  // 3,3,1 15
let pp6 = "?#???#.???.??????." // 2,1,1,1,1,4 => 8
let pp7 = "?#.???.??????." // 1,1,1,1,4
let pp8 = "?.??????." // 1,1,4 => 1
let pp9 = "???.???.???#?" // 1,1,1,3 23

//ComputeBig2(pp3, [1, 3]);

//console.log(ComputeSmall(pp9, [1,1,1,3]));

//console.log(ComputeSum2(springMap));
