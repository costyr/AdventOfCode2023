const util = require('./Util.js');

function CountTemplate(aComb) {

  let isSpring = false;
  let cc = [];
  let count = 0;
  for (let i = 0; i < aComb.length; i++)
    if (isSpring) {

      if (aComb[i] == '#')
        count++;
      else
      {
        isSpring = false;
        cc.push(count);
        count = 0;
      }
    }
    else
    {
      if (aComb[i] == '#') {
        count++;
        isSpring = true;
      }
    }

  return cc;
}

function MapCounts(aExpanded) {

  let countMap = new Map();
  for (let i = 0; i < aExpanded.length; i++)
  {
    let tt = CountTemplate(aExpanded[i]);

    let key = tt.toString();

    let cc = countMap.get(key);
    if (cc != undefined)
    {
      countMap.set(key, cc + 1);
    }
    else
      countMap.set(key, 1);
  }
  
  return countMap;
}

function GenerateAll(aTemplate, aExpanded) {

  let count = 0;
  for (let i = 0; i < aTemplate.length; i++)
    if (aTemplate[i] == '?')
    {
      let t1 = util.CopyObject(aTemplate);
      t1[i] = '#';
      GenerateAll(t1, aExpanded);
      
      let t2 = util.CopyObject(aTemplate);
      t2[i] = '.';
      GenerateAll(t2, aExpanded);
      count ++;
    }

  if (count == 0)
    aExpanded.push(aTemplate);

  return;
}

function ComputeSum(aSpringMap) {

  let sum = 0;
  for (let i = 0; i < aSpringMap.length; i++)
  {
    let ee = [];
    GenerateAll(aSpringMap[i].t, ee);

    let ssMap = MapCounts(ee);

    console.log(ssMap);

    let key = aSpringMap[i].o.toString();

    sum += ssMap.get(key);
  }

  return sum;
}

let springMap = util.MapInput("./Day12TestInput.txt", (aElem) => {
  let line = aElem.split(" ");

  return { t: line[0].split(""), o: line[1].split(",").map((aElem)=>{ return parseInt(aElem);})};

}, "\r\n");

console.log(springMap);

console.log(ComputeSum(springMap));
