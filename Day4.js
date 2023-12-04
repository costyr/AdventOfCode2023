const { compileFunction } = require('vm');
const util = require('./Util.js');
const { access } = require('fs');

function ComputeScore(aCards) {
  let sum = 0;
  for (let i = 0; i < aCards.length; i++)
  {
    let count = 0;
    for (let j = 0; j < aCards[i].winners.length; j++)
    {
      if (aCards[i].winners[j] == -1)
        continue;

      if (aCards[i].all.indexOf(aCards[i].winners[j]) >= 0)
        count ++;
    }

    if (count > 0) {

      console.log(aCards[i].card + ": " + Math.pow(2 , count - 1));

      sum += Math.pow(2 , count - 1);
    }
  }

  return sum;
}

let cards = util.MapInput("./Day4Input.txt", (aElem) => {

  let card = aElem.split(": ");

  let cardID = parseInt(card[0].split(" ")[1]);

  let board = card[1].split(" | ");

  let winners = board[0].split(" ").map((aElem)=> { if (aElem == "") return -1; else return parseInt(aElem);});
  let all = board[1].split(" ").map((aElem)=> { if (aElem == "") return -1; else return parseInt(aElem);});

  return { card: cardID, winners: winners, all:all };

}, "\r\n");

console.log(cards);

console.log(ComputeScore(cards));
