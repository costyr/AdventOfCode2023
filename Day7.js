const util = require('./Util.js');

const kCardOrder = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const kCardOrder2 = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

function ComputeType(aCards) {
  let nn = new Map();

  aCards.split("").reduce((aTypeMap, aElem) => {
    let pp = aTypeMap.get(aElem);
    if (pp != undefined)
      pp.count++;
    else
      aTypeMap.set(aElem, { count: 1 });

    return aTypeMap;
  }, nn);

  if (nn.size == 1)
    return 7;
  else if (nn.size == 2) {
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

function ComputeType2(aCards) {
  let nn = new Map();

  aCards.split("").reduce((aTypeMap, aElem) => {
    let pp = aTypeMap.get(aElem);
    if (pp != undefined)
      pp.count++;
    else
      aTypeMap.set(aElem, { count: 1 });

    return aTypeMap;
  }, nn);

  let jokers = nn.get('J');

  let jokersCount = (jokers != undefined) ? jokers.count : 0;

  let max = 0;
  let maxCard;
  for (let [key, value] of nn)
    if (key != 'J' && value.count > max) {
      max = value.count;
      maxCard = key;
    }

  if (maxCard != undefined && jokersCount > 0) {
    nn.set(maxCard, { count: max + jokersCount });
    nn.delete('J');
  }

  if (nn.size == 1)
    return 7;
  else if (nn.size == 2) {
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

  let type2 = ComputeType(cardAndScore[0]);

  let type = ComputeType2(cardAndScore[0]);

  let score = parseInt(cardAndScore[1]);

  return { cards: cards, type: type, type2: type2, score: score };

}, "\r\n");

allCards.sort((a, b) => {

  if (a.type == b.type) {
    for (let i = 0; i < a.cards.length; i++)
      if (a.cards[i] != b.cards[i])
        return kCardOrder2.indexOf(a.cards[i]) - kCardOrder2.indexOf(b.cards[i]);

    return 0;
  }

  return a.type - b.type;
});

console.log(allCards);

let sum = 0;
for (let i = 0; i < allCards.length; i++)
  sum += (i + 1) * allCards[i].score;

console.log(sum);