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
        .sort((a,b) => a-b)

    console.log("initial state:",state)

    const mid = Math.ceil(state.length / 2);
    const median = state.length % 2 == 0 ? (state[mid] + state[mid - 1]) / 2 : state[mid - 1];
    const average = Math.ceil(state.reduce((sum, x) => sum += x, 0) / state.length)
    console.log("median: ", median);
    console.log("average: ", average);

    let calcFuel = (pos, goal) => {
        let steps = Math.abs(pos-goal)

//        console.log(Array(8).join('-'))
        let fuel = 0
        for (let fuelUse = 1; fuelUse <= steps; fuelUse++) {
            fuel += fuelUse
//            console.log(Math.min(pos,goal), Math.max(pos,goal), " => ", fuelUse, " = ", fuel)
        }
        return fuel
    }

    let bestOption = null
    for (let i = Math.min(...state); i <= Math.max(...state); i++) {
        let total = state
            .map(shipPos => calcFuel(shipPos, i))
            .reduce((sum, x) => sum+=x)

        if (!bestOption || total < bestOption) {
            console.log(i, total)
            bestOption = total
        }
    }
/*

    let val = state
        .map(x => Math.abs(median-x))
        .reduce((sum, x) => sum+=x)

    console.log(val)
*/
    console.log("Fertig")

})
