const util = require('./Util.js');

const kCardOrder = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const kCardOrder2 = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

function MapByFrequency(aCards) {
  let cardFrequency = new Map();

  aCards.split("").reduce((aTypeMap, aElem) => {
    let pp = aTypeMap.get(aElem);
    if (pp != undefined)
      pp.count++;
    else
      aTypeMap.set(aElem, { count: 1 });

    return aTypeMap;
  }, cardFrequency);

  return cardFrequency;
}

function ComputeTypeFromFrequency(aCardFrequencyMap) {
  if (aCardFrequencyMap.size == 1)
    return 7;
  else if (aCardFrequencyMap.size == 2) {
    for (let [key, value] of aCardFrequencyMap)
      if (value.count == 4)
        return 6;
    return 5;
  }
  else if (aCardFrequencyMap.size == 3) {
    for (let [key, value] of aCardFrequencyMap)
      if (value.count == 3)
        return 4;
    return 3;
  }
  else if (aCardFrequencyMap.size == 4)
    return 2;
  else if (aCardFrequencyMap.size == 5)
    return 1;
}

function ComputeType(aCards) {
  return ComputeTypeFromFrequency(MapByFrequency(aCards));
}

function ComputeType2(aCards) {
  let freqMap = MapByFrequency(aCards);

  let jokers = freqMap.get('J');

  let jokersCount = (jokers != undefined) ? jokers.count : 0;

  let max = 0;
  let maxCard;
  for (let [key, value] of freqMap)
    if (key != 'J' && value.count > max) {
      max = value.count;
      maxCard = key;
    }

  if (maxCard != undefined && jokersCount > 0) {
    freqMap.set(maxCard, { count: max + jokersCount });
    freqMap.delete('J');
  }

  return ComputeTypeFromFrequency(freqMap);
}

function ComputeScore(aAllCards) {
  let score = aAllCards.reduce((aTotal, aElem, aIndex) => {
    return aTotal + (aIndex + 1) * aElem.score;
  }, 0);
  return score;
}

function SortAndComputeScore(aAllCards) {
  aAllCards.sort((a, b) => {

    if (a.type == b.type) {
      for (let i = 0; i < a.cards.length; i++)
        if (a.cards[i] != b.cards[i])
          return kCardOrder.indexOf(a.cards[i]) - kCardOrder.indexOf(b.cards[i]);

      return 0;
    }

    return a.type - b.type;
  });

  return ComputeScore(aAllCards);
}

function SortAndComputeScore2(aAllCards) {
  aAllCards.sort((a, b) => {

    if (a.type2 == b.type2) {
      for (let i = 0; i < a.cards.length; i++)
        if (a.cards[i] != b.cards[i])
          return kCardOrder2.indexOf(a.cards[i]) - kCardOrder2.indexOf(b.cards[i]);

      return 0;
    }

    return a.type2 - b.type2;
  });

  return ComputeScore(aAllCards);
}

let allCards = util.MapInput("./Day7Input.txt", (aElem) => {

  let cardAndScore = aElem.split(" ");

  let cards = cardAndScore[0].split("");

  let type = ComputeType(cardAndScore[0]);

  let type2 = ComputeType2(cardAndScore[0]);

  let score = parseInt(cardAndScore[1]);

  return { cards: cards, type: type, type2: type2, score: score };

}, "\r\n");

console.log(SortAndComputeScore(allCards));
console.log(SortAndComputeScore2(allCards));
