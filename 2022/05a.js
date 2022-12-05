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
    console.log("------------------------------------------------")
};


// Lies den Input der Aufgabe zeilenweise in `lines` Array ein
var lines = []
rl.on('line', x => lines.push(x))
rl.on('close', () => {

  let [ stacks, moves ] = lines.join("\n").split("\n\n")
  //console.debug("Crates: \n", crates, "\nMoves: \n", moves)
  console.debug(stacks, moves)

  // parse stacks
  stacks = stacks.split("\n").map(line => Array.from(line))
  stacks = stacks[0].map((val, index) => stacks.map(row => row[index]).reverse())
  stacks = stacks.filter(x => parseInt(x[0]))
  stacks = stacks.map(stack => stack.filter(x => x != " "))
  console.debug(stacks)

  // parse moves
  moves = moves.split("\n").map(move => {
    return move.match(/move (\d+) from (\d+) to (\d+)/).slice(1, 4).map(x => parseInt(x))
  })
  console.debug(moves)

  // execute moves
  moves.map(move => {
    let repeat = move[0]
    let fromStack = move[1]-1
    let toStack = move[2]-1

    for (let i = 0; i < repeat; i++)
      stacks[toStack].push(stacks[fromStack].pop())
  })
  console.log(stacks)

  console.log(stacks.reduce( (acc = [], stack) => {
    acc.push(stack.pop())
    return acc
  }, []).join(""))
})
