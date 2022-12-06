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

  let buffer = Array.from(lines.join(""))
  console.debug(buffer)

  // from https://stackoverflow.com/questions/57001515/sliding-window-over-array-in-javascript
  function* windowGenerator(buffer, size) {
    for(let index = 0; index+size <= buffer.length; index++) {
      yield buffer.slice(index, index+size);
    }
  }

  let markerLength = 14 // 4
  let i = markerLength;
  for (const sequence of windowGenerator(buffer, markerLength)) {

    // if sequence is marker then return
    if ([... new Set(sequence)].length == markerLength) {
      console.log("Sequence found!", i)
      break
    }
    i++;
  }







})
