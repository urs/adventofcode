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
  To help prioritize item rearrangement, every item type can be converted to a priority:

  Lowercase item types a through z have priorities 1 through 26.
  Uppercase item types A through Z have priorities 27 through 52.
  In the above example, the priority of the item type that appears in both
  compartments of each rucksack is 16 (p), 38 (L), 42 (P), 22 (v), 20 (t),
  and 19 (s); the sum of these is 157.

  Find the item type that appears in both compartments of each rucksack.
  What is the sum of the priorities of those item types?
  */

  var rucksacks = lines.map(x => [x.slice(0, x.length/2), x.slice(x.length/2)])
  // console.debug(rucksacks)

  rucksacks = rucksacks.map(
    rucksack => rucksack.map(
      compartment => compartment.split("")
    )
  );
  // console.debug(rucksacks)

  rucksacks = rucksacks.map(
    rucksack => [... new Set(rucksack[0].filter(v => rucksack[1].includes(v)))]
  );
  console.debug(rucksacks)

  var mapToPriority = x => {
    let v = x.charCodeAt(0)
    if (v > 90) return v - 96
    else return v - 38
  }

  var priorities = rucksacks.map(
    rucksack => rucksack.map(
      common => mapToPriority(common)
    ).reduce((acc, val) => acc+val)
  ).reduce((acc, val) => acc+val)

  console.log(priorities)


})
