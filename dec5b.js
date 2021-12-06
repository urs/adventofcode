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

    lines = lines.map(parseLine)
    //.filter(onlyStraightFilter)

    var dim = Math.max(...lines.flat(2))

    var matrix = lines.reduce((matrix, l) => {

        l = l.sort((a,b) => a[0]<b[0]?-1:1)

        let x1 = l[0][0]
        let y1 = l[0][1]
        let x2 = l[1][0]
        let y2 = l[1][1]

        let dx = x1==x2 ? 0 : 1
        let dy = y1==y2 ? 0 : y1<y2 ? 1 : -1

        let x = x1
        let y = y1
        matrix[y][x]++
        do {
            y += dy
            x += dx
            matrix[y][x]++
        } while (x != x2 || y != y2) 

        return matrix
    }, new Array(dim+1).fill(0).map(x => Array(dim+1).fill(0)))

//    console.table(matrix.map(r => r.map(v => v==0?" ":v)))

    var count = matrix.flat().filter(x => x > 1).length

    console.log(count)
    console.log("Fertig")
})
