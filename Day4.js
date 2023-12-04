const util = require('./Util.js');

function ComputeScore(aCards) {
  return aCards.reduce((aTotal, aCard) => {
    let count = 0;
    for (let j = 0; j < aCard.winners.length; j++) {
      if (aCard.winners[j] == -1)
        continue;

      if (aCard.all.indexOf(aCard.winners[j]) >= 0)
        count++;
    }

    let score = 0;
    if (count > 0) {
      score = Math.pow(2, count - 1);

      console.log(aCard.card + ": " + score);

      for (let l = 0; l < aCard.count; l++)
        for (let k = 1; k <= count; k++) {
          let ci = aCard.card + k;

          aCards[ci - 1].count++;
        }
    }

    return aTotal + score;
  }, 0);
}

function ComputeScore2(aCards) {
  return aCards.reduce((aTotal, aElem) => {
    return aTotal + aElem.count;
  }, 0);
}

let cards = util.MapInput("./Day4Input.txt", (aElem) => {

  let card = aElem.split(": ");

  let uu = card[0].split(" ");

  let cardID = parseInt(uu[uu.length - 1]);

  let board = card[1].split(" | ");

  let winners = board[0].split(" ").map((aElem) => { if (aElem == "") return -1; else return parseInt(aElem); });
  let all = board[1].split(" ").map((aElem) => { if (aElem == "") return -1; else return parseInt(aElem); });

  return { card: cardID, count: 1, winners: winners, all: all };

}, "\r\n");

console.log(ComputeScore(cards));

console.log(ComputeScore2(cards));