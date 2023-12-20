const util = require('./Util.js');

function ProcessPulse(aType, aModuleName, aFromModule, aModules, aQueue, aTotal) {

  if (aType == 0)
    aTotal.low++;
  else
    aTotal.high++;

  let mm = aModules.get(aModuleName);

  if (mm === undefined) {
    if (aType == 0)
      console.log(aModuleName + " " + aTotal);
    return;
  }

  if (mm.type == 'b') {
    for (let i = 0; i < mm.modules.length; i++)
      aQueue.push({ type: 0, to: mm.modules[i], from: aModuleName });
  }
  else if (mm.type == '&') {
    mm.pulseTypes.set(aFromModule, aType);

    let newType = 0;
    for (let [key, value] of mm.pulseTypes) {
      if (value == 0) {
        newType = 1;
        break;
      }
    }

    for (let i = 0; i < mm.modules.length; i++)
      aQueue.push({ type: newType, to: mm.modules[i], from: aModuleName });
  }
  else {
    if (aType == 1)
      return;

    let type = 0;
    if (mm.on) {
      mm.on = false;
      type = 0;
    }
    else {
      mm.on = true;
      type = 1;
    }

    for (let i = 0; i < mm.modules.length; i++)
      aQueue.push({ type: type, to: mm.modules[i], from: aModuleName });
  }
}

function SendPulses(aCount, aModules) {

  let total = { low: 0, high: 0 };

  for (let i = 0; i < aCount; i++) {

    let queue = [{ type: 0, to: "broadcaster", from: "" }];

    let hh = aModules.get("lg");

    let count = 0;
    for (let [k, v] of hh.pulseTypes)
      if (v == 1) {
        count ++;
      }

    if (count > 1) {
      console.log(i + " " + JSON.stringify(hh.pulseTypes));
    }

    while (queue.length > 0) {
      let gg = queue.pop();
      ProcessPulse(gg.type, gg.to, gg.from, aModules, queue, total);
    }
  }

  return total.low * total.high;
}

function UpdateConnected(aModules) {
  for (let [key, value] of aModules) {
    for (let i = 0; i < value.modules.length; i++) {
      let vv = aModules.get(value.modules[i]);

      if ((vv != undefined) && (vv.type == '&')) {
        vv.pulseTypes.set(key, 0);
      }
    }
  }
}

let modules = new Map();
util.MapInput("./Day20Input.txt", (aElem) => {
  let ww = aElem.split(" -> ");

  let gg = ww[1].split(", ");

  let state = { on: false, pulseTypes: new Map(), type: ww[0][0], modules: gg };

  modules.set(ww[0][0] == '%' || ww[0][0] == '&' ? ww[0].substr(1) : ww[0], state);
}, "\r\n");

UpdateConnected(modules);

console.log(modules);

console.log(SendPulses(1000000000000, modules));
