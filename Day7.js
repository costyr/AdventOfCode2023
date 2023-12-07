const util = require('./Util.js');

const kCardOrder = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];

function ComputeType(aCards) {
  let nn = new Map();

  aCards.split("").reduce((aTypeMap, aElem)=>{
    let pp = aTypeMap.get(aElem);   
    if (pp != undefined)
      pp.count++;
    else
      aTypeMap.set(aElem, {count: 1});

    return aTypeMap;
  }, nn);

  if (nn.size == 1)
    return 7;
  else if (nn.size == 2)
  {
    for (let [key, value] of nn)
      if (value.count == 4)
        return 6;
    return 5;  
  }
  else if (nn.size == 3) {
    for (let [key, value] of nn)
      if (value.count == 3)
        return 4;
    return 3;
  }
  else if (nn.size == 4)
    return 2;
  else if (nn.size == 5)
    return 1;
}

let allCards = util.MapInput("./Day7Input.txt", (aElem) => {

  let cardAndScore = aElem.split(" ");

  let cards = cardAndScore[0].split("");

  let type = ComputeType(cardAndScore[0]);

  let score = parseInt(cardAndScore[1]);

  return { cards: cards, type: type, score: score };

}, "\r\n");

allCards.sort((a, b)=>{ 

  if (a.type == b.type)
  {
    for (let i = 0; i < a.cards.length; i++)
      if (a.cards[i] != b.cards[i])
        return kCardOrder.indexOf(a.cards[i]) - kCardOrder.indexOf(b.cards[i]);

    return 0;
  }

  return a.type - b.type; 
});

console.log(allCards);

let sum = 0;
for (let i = 0; i < allCards.length; i++)
  sum += (i + 1) * allCards[i].score;

console.log(sum);