require('process')

// Bereite dieses Programm auf STDIN / STDOUT Standard vor (nicht wichtig)
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Lies den Input der Aufgabe zeilenweise in `lines` Array ein
var lines = []
rl.on('line', x => lines.push(x))
rl.on('close', () => {

  // in `lines` stehen alle Zeilen des Inputs der Aufgabe und warten auf Analyse bzw Verarbeitung
  var input = lines.join("\n")


  var groups = input.split("\n\n")
//console.log(groups)

  var elves = groups.map(str => str.split("\n").map(x => parseInt(x)))
//console.log(elves)

  var caloriesCarried = elves.map(
    listeAllerKalorienEinesElfs => listeAllerKalorienEinesElfs.reduce(
      (sum, value) => sum += value
    )
  )

  caloriesCarried.sort( (a, b) => {

    if (a > b) return 1
    if (b > a) return -1
    return 0

  })


  var top1 = caloriesCarried.pop()
  var top2 = caloriesCarried.pop()
  var top3 = caloriesCarried.pop()

  console.log(top1 + top2 + top3)



  // TODO: Finde heraus, wie viele Kalorien der Elf mit den meisten Kalorien im Snack-Gepäck trägt

  /*
  Ziel: elves = [
    [1000, 2000, 3000],
    [4000],
    [5000, 6000],
    [7000, 8000, 9000],
    [10000]
  ]
  */

//    let caloriesOfOneSnack = parseInt(lines[i])








})
