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

  if (isSpring)
    cc.push(count);  

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

function GenerateAll(aTemplate, aIndex, aExpanded) {

  //console.log(aExpanded.length);

  let count = 0;
  for (let i = aIndex; i < aTemplate.length; i++)
    if (aTemplate[i] == '?')
    {
      let t1 = aTemplate.slice();
      t1[i] = '#';
      GenerateAll(t1, i + 1, aExpanded);
      
      let t2 = aTemplate.slice();
      t2[i] = '.';
      GenerateAll(t2, i + 1, aExpanded);
      count ++;
      break;
    }

  if (count == 0) {

    let existing = aExpanded.find((aElem)=>{

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

function Test1(aPattern) {
  let ee = [];
    GenerateAll(aPattern, 0, ee);

    let ssMap = MapCounts(ee);

    console.log(ssMap);
}

function ComputeArrangements(aTemplate, aIndex, aIsSpring, aCount, aPattern, aTarget, aTotal) {

  if (aPattern.length > 0)
  {
    for (let j = 0; j < Math.min(aPattern.length, aTarget.length); j++)
      if (aPattern[j] != aTarget[j])
        return;
  }

  if (aPattern.length > aTarget.length)
    return;

  for (let i = aIndex; i < aTemplate.length; i++)
    if (aIsSpring) {
      if (aTemplate[i] == '?')
      {
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
      else if (aTemplate[i] == '#')
      {
        aCount++;   
      }
      else 
      {
        aIsSpring = false;
        aPattern.push(aCount);
        aCount = 0;
      }    
  }
  else
  {
    if (aTemplate[i] == '?')
      {  
        let t1 = aTemplate.slice();
        t1[i] = "#";
        ComputeArrangements(t1, i + 1, true, 1, aPattern.slice(), aTarget, aTotal);
      
        let t2 = aTemplate.slice();
        t2[i] = ".";
        ComputeArrangements(t2, i + 1, false, 0, aPattern.slice(), aTarget, aTotal);
        break;
      }
      else if (aTemplate[i] == '#')
      {
        aCount++;   
        aIsSpring = true;
      }
  }

  if (aTemplate.indexOf('?') > 0)
    return;
  //if (aIndex >= aTemplate.length) {

  if (aIsSpring)
    aPattern.push(aCount);

  if (aPattern.length != aTarget.length)
    return;

  for (let j = 0; j < aPattern.length; j++)
    if (aPattern[j] != aTarget[j])
      return;

  console.log(aTemplate + " " + aIndex + " " + aPattern);
  aTotal.total++;
  //}
}

function ComputeSum(aSpringMap) {

  let sum = 0;
  for (let i = 0; i < aSpringMap.length; i++)
  {
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

function ComputeSum2(aSpringMap) {

  let sum = 0;
  for (let i = 0; i < aSpringMap.length; i++)
  {
    let rr = { total: 0 };

    let oo2 = [];
    for (let j = 0; j < 5; j++)
      oo2 = oo2.concat(aSpringMap[i].o);

    let tt2 = [];
    for (let j = 0; j < 5; j++)
    {
      if (j > 0)
        tt2.push('?');
      tt2 = tt2.concat(aSpringMap[i].t);
    }

    ComputeArrangements(tt2, 0, false, 0, [], oo2, rr);

    console.log(tt2 + " " + oo2 + " => " + rr.total);

    sum += rr.total;
  }

  return sum;
}

let springMap = util.MapInput("./Day12Input.txt", (aElem) => {
  let line = aElem.split(" ");

  return { t: line[0].split(""), o: line[1].split(",").map((aElem)=>{ return parseInt(aElem);})};

}, "\r\n");

//console.log(springMap);

//console.log(ComputeSum2(springMap));

//Test1("##???????????".split(""));
//Test1("?###?????????".split(""));

//console.log(util.ArrangementsN(['.', '#'], 2));

//let ee = [];
//let rr = { total: 0 };
//ComputeArrangements("?###????????".split(""), 0, false, 0, [], [3, 2, 1], rr);

//console.log(rr);

//console.log(ee);

//console.log(['?', '?', '?', '.', '#', '#', '#'].toString());

let rr = { total: 0 };
ComputeArrangements("?????????##???????????????##???????????????##???????????????##?????".split(""), 0, false, 0, [], [1, 9, 1, 1, 9, 1, 1, 9, 1, 1, 9, 1], rr);

console.log(rr);

let rr1 = { total: 0 };
//ComputeArrangements("??????????##?????".split(""), 0, false, 0, [], [1, 9, 1], rr1);

console.log(rr1);

let rr2 = { total: 0 };
//ComputeArrangements("?????????##??????".split(""), 0, false, 0, [], [1, 9, 1], rr2);

console.log(rr2);