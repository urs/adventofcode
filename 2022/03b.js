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

  var groups = []
  for (let i = 0; i<lines.length; i+=3) {

    var elvesGroup = [lines[i], lines[i+1], lines[i+2]]
    elvesGroup = elvesGroup.map(x => x.split(""))
    console.debug(elvesGroup)

    elvesGroup = elvesGroup.map(group => [... new Set(group)])
    console.debug(elvesGroup)

    var badge = elvesGroup.reduce(
      (acc, elf) => [... new Set(acc.filter(v => elf.includes(v)))]
    );
    console.debug("---------------------------------")
    groups.push(badge.pop())
  }
  console.debug(groups)

  var mapToPriority = x => {
    let v = x.charCodeAt(0)
    if (v > 90) return v - 96
    else return v - 38
  }

  var priorities = groups.map(mapToPriority).reduce((acc, val) => acc+val)

  console.log(priorities)

})
