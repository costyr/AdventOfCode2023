const util = require('./Util.js');

function ComputeSum(aCodes) {
  
  let total = 0;
  for (let i = 0; i < aCodes.length; i++)
  {
    let sum = 0;
    for (let j = 0; j < aCodes[i].length; j++)
    {
      let cc = aCodes[i][j].charCodeAt(0);
      sum += cc;
      sum *= 17;
      sum %= 256;
    }

    console.log(sum);

    total += sum;
  }
  
  return total;
}

let codes = util.MapInput("./Day15Input.txt", (aElem) => {
 
  return aElem.split("");

}, ",");

console.log(codes);

console.log(ComputeSum(codes));
