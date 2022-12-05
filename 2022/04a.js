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

  var pairs = lines.map(l => l.split(",").map(p => p.split("-").map(x => parseInt(x))))
  console.debug("Parsed input data", pairs)

  // Sort each pair so that lowest range start is first
  pairs = pairs.map(pair => pair.sort((r1, r2) => (r1[0] - r2[0]) * 1000 + (r2[1] - r1[1])))
  console.debug("Sorted pairs by lowest range start first", pairs)

  // Filter only pairs where second range end is lower/equal to first range end
  pairs = pairs.filter(pair => pair[0][1] >= pair[1][1])
  console.debug("Filterted where 2nd range end is lower/equal to 1st", pairs)

  console.log(pairs.length)

})
