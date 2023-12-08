const util = require('./Util.js');

function FindEndings(aEnd, aDirsMap) {
  let allStarts = [];
  for (let [key, value] of aDirsMap) {
    if (key[key.length - 1] == aEnd)
      allStarts.push(key);
  }

  return allStarts;
}

function FindZZZ(aStart, aEnd2, aInsts, aDirsMap) {

  let cc = aStart;
  let i = 0;
  let count = 0;
  for (; ;) {

    if (!aEnd2 && (cc == "ZZZ"))
      break;

    if ((aEnd2 && cc[cc.length - 1] == 'Z'))
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

    count++;
  }

  return count;
}

function FindXXZ(aAllStarts, aInsts, aDirsMap) {
  let freqs = aAllStarts.map((aElem) => {
    return FindZZZ(aElem, true, aInsts, aDirsMap);
  });
  return util.LCM(...freqs);
}

let insts = "";
let dirsMap = new Map();

util.MapInput("./Day8Input.txt", (aElem, aIndex) => {
  if (aIndex == 0)
    insts = aElem;
  else if (aIndex == 1) {

  }
  else {
    let pp = aElem.split(" = ");

    let dd = pp[1].slice(1, pp[1].length - 1).split(", ");

    dirsMap.set(pp[0], { l: dd[0], r: dd[1] });
  }
}, "\r\n");

console.log(FindZZZ("AAA", false, insts, dirsMap));

let allStarts = FindEndings('A', dirsMap);

console.log(FindXXZ(allStarts, insts, dirsMap));
