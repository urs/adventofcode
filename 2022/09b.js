require('process')

const { setMaxIdleHTTPParsers } = require('http');
// Bereite dieses Programm auf STDIN / STDOUT Standard vor (nicht wichtig)
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


const optionDefinitions = [
    { name: 'debug', alias: 'd', type: Boolean, defaultValue: false },
    { name: 'grid', alias: 'g', type: Number, defaultValue: 10 },
    { name: 'startx', alias: 'x', type: Number, defaultValue: 0 },
    { name: 'starty', alias: 'y', type: Number, defaultValue: 0 },
    { name: 'sleep', alias: 'm', type: Number, defaultValue: 0 },
    { name: 'rope', alias: 'r', type: Number, defaultValue: 2 }
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

const myArgs = process.argv.slice(2);
let gridSize = options.grid
let startPos = {x: options.startx, y: options.starty}
let sleepTime = options.sleep
let ropeLength = options.rope
    
if (options.debug) {
    console.debugging = true
    console.debug(options)
}

console.debug = function () {
    if (!console.debugging) return;
    console.log.apply(this, arguments);
    console.log("------------------------------------------------")
};

var comments = []
var ropePos = Array.from(Array(ropeLength))
    .map(x => { return {... startPos}})

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
        .map(x => Array.from(".".repeat(gridSize)))
    let tailTrail = Array.from(Array(gridSize))
        .map(x => Array.from(".".repeat(gridSize)))

    let render = () => {
        if (!console.debugging) return
        console.clear()

        // Draw grid with rope
        for (let y = grid.length-1; y >= 0; y--) {
            let row = [...grid[y]]

            for (let i = ropePos.length - 1; i >= 0; i--) 
                if (y == ropePos[i].y) 
                    row[ropePos[i].x] = i == 0 ? 'H' : i
            console.log(row.join(""), tailTrail[y].join(""))
        }

        console.log(comments.join("\n"))

        sleep(sleepTime)
    }

    render()



    let executeMovement = (movement) => {
        comments.push(`Execute Movement ${movement}`)

        comments.push(`Calculating rope positions`)
        
        let headKnot = ropePos[0]
        comments.push(` -> Moving HEAD to ${movement}`)
        switch (movement) {
            case 'L': headKnot.x--; break
            case 'R': headKnot.x++; break
            case 'D': headKnot.y--; break
            case 'U': headKnot.y++; break
        }

        render()

        let prevKnot = headKnot;
        let i = 1
        while (i < ropePos.length) {

            let currentKnot = ropePos[i]

            let deltaX = prevKnot.x - currentKnot.x;
            let deltaY = prevKnot.y - currentKnot.y;
            // comments.push(` (Delta X = ${deltaX}, Delta Y = ${deltaY}`)
            
            // same row, too far away => move tail
            if (!deltaY) {
                if (Math.abs(deltaX) > 1) {
                    comments.push(` -> Moving knot #${i} on the same row by ${parseInt(deltaX / 2)}`)
                    currentKnot.x += parseInt(deltaX / 2)
                }
            }
            // same col, too far away => move tail
            else if (!deltaX) {
                if (Math.abs(deltaY) > 1) {
                    comments.push(` -> Moving knot #${i} on the same col by ${parseInt(deltaY / 2)}`)
                    currentKnot.y += parseInt(deltaY / 2)
                }
            }
            else {
                // Move diagonal if needed
                if (Math.abs(deltaX) + Math.abs(deltaY) > 2) {
                    currentKnot.x += Math.sign(deltaX) * Math.round(Math.abs(deltaX) / 2)
                    currentKnot.y += Math.sign(deltaY) * Math.round(Math.abs(deltaY) / 2)
                    comments.push(` -> Moving knot #${i} diagonal x += ${Math.round(deltaX / 2)}, y += ${Math.round(deltaY / 2)}`)
                }
            }

            // trail the movements of tail
            if (i == ropePos.length - 1) {
                tailTrail[currentKnot.y][currentKnot.x] = '#'
            }
            render()

            prevKnot = currentKnot
            i++;
        }

        comments = []

    }

    motions.map(executeMovement)

    console.log(`Tail trail is ${tailTrail.flat().filter(x => x == '#').length} long`)

})
