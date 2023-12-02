const util = require('./Util.js');

const kValidGame = { red: 12, green: 13, blue: 14 };

function ComputeValidGamesSum(aGames) {

  return aGames.reduce((aSum, aGame) => {

    let isValid = true;
    for (let j = 0; j < aGame.games.length; j++) {
      if ((aGame.games[j].red > kValidGame.red) ||
        (aGame.games[j].green > kValidGame.green) ||
        (aGame.games[j].blue > kValidGame.blue)) {
        isValid = false;
        break;
      };
    }

    if (isValid) {
      aSum += aGame.game;
    }

    return aSum;
  }, 0);
}

function ComputeMinSetsSum(aGames) {
  return aGames.reduce((aSum, aGame) => {

    let maxCubes = aGame.games.reduce((aMaxCubes, aSubGame) => {
      if (aSubGame.red > aMaxCubes.red)
        aMaxCubes.red = aSubGame.red;

      if (aSubGame.green > aMaxCubes.green)
        aMaxCubes.green = aSubGame.green;

      if (aSubGame.blue > aMaxCubes.blue)
        aMaxCubes.blue = aSubGame.blue;

      return aMaxCubes;
    }, { red: 0, green: 0, blue: 0 });
    return aSum + (maxCubes.red * maxCubes.green * maxCubes.blue);
  }, 0);
}

let cc = util.MapInput("./Day2Input.txt", (aElem) => {

  let line = aElem.split(": ");

  let game = parseInt(line[0].split(" ")[1]);

  let games = line[1].split("; ");

  let colors = { game: game, games: [] };
  for (let i = 0; i < games.length; i++) {
    let cubs = games[i].split(", ");

    let pp = { red: 0, green: 0, blue: 0 };
    for (let j = 0; j < cubs.length; j++) {
      let cc = cubs[j].split(" ");
      if (cc[1] == "red")
        pp.red = parseInt(cc[0]);
      else if (cc[1] == "green")
        pp.green = parseInt(cc[0]);
      else if (cc[1] == "blue")
        pp.blue += parseInt(cc[0]);
    }

    colors.games.push(pp);
  }

  return colors;
}, "\r\n");

console.log(ComputeValidGamesSum(cc));
console.log(ComputeMinSetsSum(cc));
