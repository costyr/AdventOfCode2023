const util = require('./Util.js');

function FindEndings(aEnd, aDirsMap) {
  let allStarts = [];
  for (let [key, value] of aDirsMap)
  {
    if (key[key.length - 1] == aEnd)
      allStarts.push(key);
  }

  return allStarts;
}

function FindZZZ(aStarts, aEnd2, aInsts, aDirsMap) {

  let cc = aStarts;
  let i = 0;
  let count = 0;
  let prevCount = 0;
  for(;;)
  {
    let tt = 0;
    for (let j = 0; j < cc.length; j++) {
      if ((aEnd2 && cc[j][cc[j].length - 1] =='Z') || 
          (cc[j] == "ZZZ"))
        tt++;
    }

    if (tt == cc.length)
    {
      if (prevCount == count)
        break;
      else {
       prevCount = count;
       count = 0;
      }
    }

    let ii = aInsts[i];

    for (let j = 0; j < cc.length; j++) {
      let yy = aDirsMap.get(cc[j]);

      if (ii == 'L')
        cc[j] = yy.l;
      else
        cc[j] = yy.r;
    }
    
    i++;
    if (i >= aInsts.length)
      i = 0;

    count ++;
    //console.log(cc + " " + tt);
  }

  return count;
}

let insts = "";
let dirsMap = new Map();

util.MapInput("./Day8Input.txt", (aElem, aIndex) => {
  if (aIndex == 0)
    insts = aElem;
  else if (aIndex == 1)
  {

  }
  else
  {
    let pp = aElem.split(" = ");

    let dd = pp[1].slice(1, pp[1].length - 1).split(", ");

    dirsMap.set(pp[0], { l: dd[0], r:dd[1] });
  } 
}, "\r\n");

console.log(insts);
console.log(dirsMap);

//console.log(FindZZZ(["AAA"], false, insts, dirsMap));

let allStarts = FindEndings('A', dirsMap);
let allEnds = FindEndings('Z', dirsMap);

console.log(allStarts);
console.log(allEnds);

let vv = [];
for (let i = 0; i < allStarts.length; i++) {
  let oo = FindZZZ([allStarts[i]], true, insts, dirsMap);
  console.log(allStarts[i] + " " + oo);
  vv.push(oo);
}

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

console.log(lcm(...vv));
