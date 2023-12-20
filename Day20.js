const util = require('./Util.js');

function ProcessPulse(aType, aModuleName, aModules, aTotal) {
  
  if (aType == 0)
    aTotal.low++;
  else
    aTotal.high++;

  let mm = aModules.get(aModuleName);

  if (mm === undefined)
  {
    console.log("Undefined module: " + aModuleName);
    return;
  }

  if (mm.type == 'b')
  {
    for (let i = 0; i < mm.modules.length; i++)
      ProcessPulse(0, mm.modules[i], aModules, aTotal);
    return;
  }
  else if (mm.type == '&')
  {
    
    
    for (let i = 0; i < mm.modules.length; i++)
      ProcessPulse(mm.pulseType == 0 ? 1 : 0, mm.modules[i], aModules, aTotal);

      mm.pulseType = aType;
  }
  else
  {
    if (aType == 1)
      return;

    let type = 0;
    if (mm.on)
    {
      mm.on = false;
      type = 0; 
    }
    else
    {
      mm.on = true;
      type = 1; 
    } 

    for (let i = 0; i < mm.modules.length; i++)
      ProcessPulse(type, mm.modules[i], aModules, aTotal);
  }
}

function SendPulses(aCount, aModules) {

  let total = {low: 0, high: 0 };
  for (let i = 0; i < aCount; i++)
    ProcessPulse(0, "broadcaster", aModules, total);

  return total.low * total.high;
}

let modules = new Map();
util.MapInput("./Day20TestInput2.txt", (aElem) => {
  let ww = aElem.split(" -> ");

  let gg = ww[1].split(", ");

  let state = { on: false, pulseType: 0,  type: ww[0][0], modules: gg };

  modules.set(ww[0][0] == '%' || ww[0][0] == '&' ? ww[0].substr(1) : ww[0], state);
}, "\r\n");


console.log(modules);

console.log(SendPulses(1000, modules));
