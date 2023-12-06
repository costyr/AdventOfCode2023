const util = require('./Util.js');

let time = [];
let distance = [];
util.MapInput("./Day6Input.txt", (aElem, aIndex) => {

  let values = aElem.split(" ").slice(1).map((aElem) => { 
    if (aElem == "") 
      return -1; 
    else 
      return parseInt(aElem); 
    }).filter((aElem) => { 
      return aElem != -1; 
    });

  if (aIndex == 0)
    time = values;
  else
    distance = values;

}, "\r\n");

console.log(time);
console.log(distance);
