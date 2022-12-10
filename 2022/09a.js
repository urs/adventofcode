require('process')

const { setMaxIdleHTTPParsers } = require('http');
// Bereite dieses Programm auf STDIN / STDOUT Standard vor (nicht wichtig)
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const myArgs = process.argv.slice(2);
let gridSize = 1000
let sleepTime = 0
var headPos = { x: Math.round(gridSize/2), y: Math.round(gridSize/2)}
var tailPos = { x: Math.round(gridSize/2), y: Math.round(gridSize/2)}

switch (myArgs[0]) {
  case '--debug':
    console.debugging = true
    gridSize = 10
    sleepTime = 500
    headPos = { x: 0, y: 0}
    tailPos = { x: 0, y: 0}
    break;
}

console.debug = function () {
    if (!console.debugging) return;
    console.log.apply(this, arguments);
    console.log("------------------------------------------------")
};

let matrixTranspose =  array => {
    return array[0].map((val, index) => array.map(row => row[index]))
  }

var comments = []

var motions = []
rl.on('line', line => {
    let [direction, amount] = line.split(" ")
    motions = motions.concat(Array(parseInt(amount)).fill(direction))
})

rl.on('close', async () => {

    let sleep = (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    let grid = Array.from(Array(gridSize))
        .map(x => Array.from(".".repeat(gridSize*2)))
    let tailTrail = Array.from(Array(gridSize))
        .map(x => Array.from(".".repeat(gridSize*2)))

    let render = () => {
        return
        console.clear()

        // Draw grid with rope
        for (let y = grid.length-1; y >= 0; y--) {
            let row = [...grid[y]]
            if (y == tailPos.y) row[tailPos.x] = "T"
            if (y == headPos.y) row[headPos.x] = "H"
            console.log(row.join(""))
        }
        console.debug("")

        // Draw tailTrail
        for (let y = tailTrail.length-1; y >= 0; y--) {
            console.log(tailTrail[y].join(""))
        }
        console.log(comments.join("\n"))

        sleep(sleepTime)
    }

    render()



    let executeMovement = (movement) => {
        comments.push(`Execute Movement ${movement}`)

        comments.push(` -> Moving HEAD to ${movement}`)
        switch (movement) {
            case 'L': headPos.x--; break
            case 'R': headPos.x++; break
            case 'D': headPos.y--; break
            case 'U': headPos.y++; break
        }

        render()

        let deltaX = headPos.x - tailPos.x;
        let deltaY = headPos.y - tailPos.y;
        comments.push(` (Delta X = ${deltaX}, Delta Y = ${deltaY}`)
        
        // same row, too far away => move tail
        if (!deltaY) {
            if (Math.abs(deltaX) > 1) {
                comments.push(` -> Moving TAIL on the same row by ${parseInt(deltaX / 2)}`)
                tailPos.x += parseInt(deltaX / 2)
            }
        }
        // same col, too far away => move tail
        else if (!deltaX) {
            if (Math.abs(deltaY) > 1) {
                comments.push(` -> Moving TAIL on the same col by ${parseInt(deltaY / 2)}`)
                tailPos.y += parseInt(deltaY / 2)
            }
        }
        else {
            // Move diagonal if needed
            if (Math.abs(deltaX) + Math.abs(deltaY) > 2) {
                tailPos.x += Math.sign(deltaX) * Math.round(Math.abs(deltaX) / 2)
                tailPos.y += Math.sign(deltaY) * Math.round(Math.abs(deltaY) / 2)
                comments.push(` -> Moving TAIL diagonal x += ${Math.round(deltaX / 2)}, y += ${Math.round(deltaY / 2)}`)
            }
        }

        tailTrail[tailPos.y][tailPos.x] = '#'

        render()
        comments = []

    }

    motions.map(executeMovement)

    console.log(`Tail trail is ${tailTrail.flat().filter(x => x == '#').length} long`)

})
