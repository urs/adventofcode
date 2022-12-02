require('process')

// Bereite dieses Programm auf STDIN / STDOUT Standard vor (nicht wichtig)
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const myArgs = process.argv.slice(2);
switch (myArgs[0]) {
  case '--debug':
    console.debugging = true
    break;
}

console.debug = function () {
    if (!console.debugging) return;
    console.log.apply(this, arguments);
};


// Lies den Input der Aufgabe zeilenweise in `lines` Array ein
var lines = []
rl.on('line', x => lines.push(x))
rl.on('close', () => {
  /*
  Rules of the game:
  ROCK beats SCISSORS
  SCISSORS beats PAPER
  PAPER beats ROCK

  Score of round = Scoring + Outcome
  Total Score = SUM(Score of rounds)
  */


  // Scorings
  const ROCK = 1
  const PAPER = 2
  const SCISSORS = 3

  // Outcomes
  const LOSS = 0
  const DRAW = 3
  const WIN = 6

  // Normalized Input
  let inputMap = {
    'A': ROCK, 'B': PAPER, 'C': SCISSORS,
    'X': LOSS, 'Y': DRAW, 'Z': WIN
  }
  var normalizeInput = (input) => inputMap[input];

  console.debug("input map", inputMap)

  // map lines into games
  var games = lines.map(line => line.split(" ").map(normalizeInput))
  console.debug("list of games as tuples of THEIR choice / outcome", games)

  // Inverses spiel
  var playInverted = (theirs, outcome) => {
    if (outcome == DRAW) return theirs
    if (outcome == WIN) return theirs % 3 + 1
    else return (theirs + 1) % 3 + 1
  }

  // list of tuples of [result, myChoice] to calculate scores
  var results = games.map(([theirs, outcome]) => [outcome, playInverted(theirs, outcome)]);
  console.debug("List of tuples of result and myChoice", results);

  var score = ([outcome, choice]) => outcome + choice
  var scores = results.map(score)
  console.debug("Scores", scores)
  var total = scores.reduce((acc, val) => acc+val)
  console.log(total)





})
