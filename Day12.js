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

let springMap = util.MapInput("./Day12TestInput.txt", (aElem) => {
  let line = aElem.split(" ");

  return { t: line[0].split(""), o: line[1].split(",").map((aElem)=>{ return parseInt(aElem);})};

}, "\r\n");

//console.log(springMap);

//console.log(ComputeSum(springMap));

//console.log(util.ArrangementsN(['.', '#'], 2));

let ee = [];
GenerateAll(['.', '?', '?', '?','#', '?', '?', '.','?', '#', '#', '?','#', '?', '?', '?'], 0, ee);

console.log(ee);
