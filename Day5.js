const util = require('./Util.js');

function GenerateSeeds(aStart, aCount) {
  let seeds = [];
  for (let i = 0; i < aCount; i++)
    seeds.push(aStart + i);
  return seeds;
}

function TransformSeeds(aSeeds, aTransformMap, transformOrder) {
  let locations = aSeeds.map((aSeed) => {

    let nr = aSeed;
    console.log("-------------------------");
    for (let i = 0; i < transformOrder.length; i++) {
      let tt = aTransformMap.get(transformOrder[i]);

      let found = false;
      for (let j = 0; j < tt.length; j++) {
        let oo = tt[j];
        let maxValue = (oo[1] + oo[2]);
        if (nr >= oo[1] && nr < maxValue) {
          let offset = (nr - oo[1]);
          let bb = oo[0] + offset;

          console.log(transformOrder[i] + ": " + nr + " => " + bb);
          nr = bb;
          found = true;
          break;
        }
      }
      if (!found)
        console.log(transformOrder[i] + ": " + nr + " => " + nr);
    }

    return nr;
  });

  console.log(locations);

  return locations.reduce((aMin, aElem) => {
    if (aElem < aMin)
      return aElem;
    return aMin;
  }, Number.MAX_SAFE_INTEGER);
}

function TransformInterval(aSeedStart, aSeedEnd, aTransformMap, aTransformOrder, aTransform, aMin) {

  if (aTransform >= aTransformOrder.length) {
    if (aSeedStart < aMin.min)
      aMin.min = aSeedStart;
    return;
  }

  let start = aSeedStart;
  let end = aSeedEnd;
  console.log("-------------------------");
  let tt = aTransformMap.get(aTransformOrder[aTransform]);

  let found = false;
  let jj = [];
  for (let j = 0; j < tt.length; j++) {
    let oo = tt[j];
    let maxValue = (oo[1] + oo[2]);
    let maxEnd = (start + end) - 1;
    if (start >= oo[1] && maxEnd < maxValue) {
      let offset = (start - oo[1]);
      let newStart = oo[0] + offset;

      console.log(transformOrder[aTransform] + ": [" + start + "," + end + "] => " + "[" + newStart + "," + end + "]");
      found = true;
      jj.push(oo[1] + offset);
      jj.push(oo[1] + offset + end - 1);
      TransformInterval(newStart, end, aTransformMap, aTransformOrder, aTransform + 1, aMin);
      end = 0;
      break;
    }
    else if (oo[1] >= start && maxValue < maxEnd) {
      jj.push(oo[1]);
      jj.push(oo[1] + oo[2] - 1);
      TransformInterval(oo[0], oo[2], aTransformMap, aTransformOrder, aTransform + 1, aMin);
      found = true;
    }
    else if (start >= oo[1] && start <= maxValue && maxEnd >= maxValue) {
      let offset = (start - oo[1]);
      let newStart = oo[0] + offset;

      let newEnd = maxValue - start;
      console.log(transformOrder[aTransform] + ": [" + start + "," + newEnd + "] => " + "[" + newStart + "," + newEnd + "]");
      found = true;
      jj.push(oo[1] + offset);
      jj.push(oo[1] + offset + newEnd - 1);
      TransformInterval(newStart, newEnd, aTransformMap, aTransformOrder, aTransform + 1, aMin);
    }
    else if (maxEnd >= oo[1] && maxEnd < maxValue) {
      let newStart = oo[0];

      let newEnd = maxEnd - oo[1];

      console.log(transformOrder[aTransform] + ": [" + oo[1] + "," + newEnd + "] => " + "[" + newStart + "," + newEnd + "]");
      found = true;
      jj.push(oo[1]);
      jj.push(oo[1] + newEnd - 1);
      TransformInterval(newStart, newEnd, aTransformMap, aTransformOrder, aTransform + 1, aMin);
    }
  }
  if (!found) {
    console.log(transformOrder[aTransform] + ": [" + start + "," + end + "] => " + "[" + start + "," + end + "]");
    TransformInterval(aSeedStart, aSeedEnd, aTransformMap, aTransformOrder, aTransform + 1, aMin);
  }
  else
  {
    jj.sort((a, b)=>{return a - b;});
    jj.unshift(aSeedStart);
    jj.push(aSeedStart + aSeedEnd - 1);
    console.log(jj);
    for (let i = 0; i < jj.length; i += 2)
    {
      let s = jj[i];
      let e = jj[i + 1];

      if ( e > s)
        TransformInterval(s, e - s + 1, aTransformMap, aTransformOrder, aTransform + 1, aMin);
    }
  }
}

function TransformSeeds2(aSeeds, aTransformMap, aTransformOrder) {
  let mm = { min: Number.MAX_SAFE_INTEGER };
  for (let i = 0; i < aSeeds.length; i += 2)
    TransformInterval(aSeeds[i], aSeeds[i + 1], aTransformMap, aTransformOrder, 0, mm);
  return mm.min;
}

let transformOrder = [];

let seeds = [];
let transformMap = new Map();
util.MapInput("./Day5TestInput.txt", (aElem, aIndex) => {
  if (aIndex == 0) {
    seeds = aElem.split(" ").map((aElem, aIndex) => {
      if (aIndex == 0)
        return 0;
      else
        return parseInt(aElem);
    });
    seeds.shift();
  }
  else {
    let tt = aElem.split("\r\n").map((aElem, aIndex) => {
      if (aIndex == 0)
        return aElem.split(" ")[0];
      else {
        let pp = aElem.split(" ").map((aElem) => {
          return parseInt(aElem);
        })
        return pp;
      }
    });

    transformOrder.push(tt[0]);
    transformMap.set(tt[0], tt.slice(1));
  }
}, "\r\n\r\n");

console.log(seeds);
console.log(transformMap);
console.log(transformOrder);

console.log(TransformSeeds(seeds, transformMap, transformOrder));

console.log(TransformSeeds2(seeds, transformMap, transformOrder));
