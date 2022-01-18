require('process')

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var lines = []
rl.on('line', x => lines.push(x))
rl.on('close', () => {

    var parseLine = line => line.split(" -> ").map(x => x.split(",").map(x => parseInt(x)))
    var onlyStraightFilter = l => l[0][0] == l[1][0] || l[0][1] == l [1][1]

    lines = lines.map(parseLine).filter(onlyStraightFilter)

    var dim = Math.max(...lines.flat(2))

    var matrix = lines.reduce((matrix, l) => {
        let x1 = Math.min(l[0][0], l[1][0])
        let x2 = Math.max(l[0][0], l[1][0])
        let y1 = Math.min(l[0][1], l[1][1])
        let y2 = Math.max(l[0][1], l[1][1])

        if (y1 == y2) {
            for (let i = x1; i <= x2; i++) {
                matrix[y1][i]++
            }
        }
        else if (x1 == x2) {
            for (let i = y1; i <= y2; i++) {
                matrix[i][x1]++
            }
        }
        return matrix
    }, new Array(dim+1).fill(0).map(x => Array(dim+1).fill(0)))

//    console.table(matrix)

    var count = matrix.flat().filter(x => x > 1).length

    console.log(count)
    console.log("Fertig")
})
