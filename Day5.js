const util = require('./Util.js');

function TransformSeeds(aSeeds, aTransformMap, transformOrder) {
  let locations = aSeeds.map((aSeed)=>{

    let nr = aSeed;
    console.log("-------------------------");
    for (let i = 0; i < transformOrder.length; i++)
    {
      let tt = aTransformMap.get(transformOrder[i]);

      let found = false;
      for (let j = 0; j < tt.length; j++)
      {
        let oo = tt[j];
        let maxValue = (oo[1] + oo[2]);
        if (nr >= oo[1] && nr < maxValue)
        {
          let ll = (nr - oo[1]);
          if (ll < oo[2]) {
            let bb = oo[0] + ll;

            console.log(transformOrder[i] + ": " + nr + " => " + bb);
            nr = bb;
            found = true;         
            break; 
          }
        }  
      }
      if (!found)
        console.log(transformOrder[i] + ": " + nr + " => " + nr);
    }

    return nr;
  });

  console.log(locations);

  return locations.reduce((aMin, aElem)=>{ 
    if (aElem < aMin)
      return aElem;
    return aMin;
  }, Number.MAX_SAFE_INTEGER);
}

function TransformInterval(aSeedStart, aSeedEnd, aTransformMap, transformOrder) {

  let start = aSeedStart;
  let end = aSeedEnd;
  console.log("-------------------------");
  for (let i = 0; i < transformOrder.length; i++)
  {
    let tt = aTransformMap.get(transformOrder[i]);

    let found = false;
    for (let j = 0; j < tt.length; j++)
    {
      let oo = tt[j];
      let maxValue = (oo[1] + oo[2]);
      if (start >= oo[1] && end < maxValue)
      {
        let ll = (nr - oo[1]);
        if (ll < oo[2]) {
          let bb = oo[0] + ll;

          console.log(transformOrder[i] + ": " + nr + " => " + bb);
          nr = bb;
          found = true;         
          break; 
        }
      }  
    }
    if (!found)
      console.log(transformOrder[i] + ": " + nr + " => " + nr);
  }

  return nr;
}

let transformOrder = [];

let seeds = [];
let transformMap = new Map();
util.MapInput("./Day5Input.txt", (aElem, aIndex) => {
  if (aIndex == 0)
  {
    seeds = aElem.split(" ").map((aElem, aIndex)=>{ 
      if (aIndex == 0) 
        return 0; 
      else 
        return parseInt(aElem);
      });
    seeds.shift();    
  }
  else
  {
    let tt = aElem.split("\r\n").map((aElem, aIndex)=>{
      if (aIndex == 0)
        return aElem.split(" ")[0];
      else
      {
       let pp = aElem.split(" ").map((aElem)=>{
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
