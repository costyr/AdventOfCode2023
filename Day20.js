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

function SendPulses(aCount, aModules, aFreq) {

  let total = { low: 0, high: 0 };

  let cache = new Map();

  for (let i = 0; i < aCount; i++) {

    let queue = [{ type: 0, to: "broadcaster", from: "" }];

    while (queue.length > 0) {
      let gg = queue.shift();

      ProcessPulse(gg.type, gg.to, gg.from, aModules, queue, total);
      if (aFreq !== undefined)
        PrintPT(aModules, i, cache, aFreq);
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

function PrintPT(aModules, aCount, aCache, aFreq) {

  let ff = "";
  for (let [key, value] of aModules) {
    if (value.type == '&') {
      let gg = [];
      for (let [k, v] of value.pulseTypes)
        gg.push(v);

      //if (gg.length != 1)
      //  continue;

      //if (gg.indexOf(1) >= 0)
      //  continue;

      let kk = key + "(" + gg.toString().replaceAll(/,/g, "") + ")";

      if (kk != "lg(1000)" &&
        kk != "lg(0100)" &&
        kk != "lg(0010)" &&
        kk != "lg(0001)")
        continue;

      let pp = aCache.get(kk);

      if (pp !== undefined && (aCount - pp) > 0) {
        ff += key + (aCount - pp);
        aFreq.push(aCount - pp);
      }

      aCache.set(kk, aCount);

      //if (ff.length > 0)
      //  ff += "    "  
      //ff += kk;
    }
  }

  if (ff.length > 0)
    console.log(aCount, ff);
}

function ResetStates(aModules) {
  for (let [key, value] of aModules) {
    value.on = false;
    if (value.type !== '&')
      continue;
    for (let [k, v] of value.pulseTypes)
      value.pulseTypes.set(k, 0);
  }
}

let modules = new Map();
util.MapInput("./Day20Input.txt", (aElem) => {
  let ww = aElem.split(" -> ");

  let gg = ww[1].split(", ");

  let state = { on: false, pulseTypes: new Map(), type: ww[0][0], modules: gg };

  let bb = ww[0][0] == '%' || ww[0][0] == '&' ? ww[0].substr(1) : ww[0];

  modules.set(bb, state);
}, "\r\n");

UpdateConnected(modules);

console.log(modules);

console.log(SendPulses(1000, modules));

ResetStates(modules);

let freq = [];
SendPulses(10000, modules, freq);
console.log(util.LCM(...freq.slice(0, 4)));
