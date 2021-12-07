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

    let state = lines[0]
        .split(",")
        .map(x => parseInt(x))

    const RESET_AFTER_BIRTH = 6
    const RESET_NEWBORN = 8

    console.log("initial state:",state)
    let newDay = state => {
        // spawn new
        let newborn = Array(state.filter(x => x==0).length).fill(RESET_NEWBORN+1)
        state = state.concat(newborn)
        state = state.map(x => x==0?RESET_AFTER_BIRTH+1:x)

        // age
        return state.map(x => x-1)
    }

    for (let i = 1; i <= 80; i++) {
        state = newDay(state)
        console.log(`after ${i} days: `, state)
    }

    console.log(state.length)
    console.log("Fertig")

})
