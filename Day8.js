const util = require('./Util.js');


function FindZZZ(aInsts, aDirsMap) {

  let cc = "AAA";
  let i = 0;
  let count = 0;
  for(;;)
  {
    if (cc == "ZZZ")
      break;

    let ii = aInsts[i];

    let yy = aDirsMap.get(cc);

    if (ii == 'L')
      cc = yy.l;
    else
      cc = yy.r;
    
    i++;
    if (i >= aInsts.length)
      i = 0;

    count ++;
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

console.log(FindZZZ(insts, dirsMap));
