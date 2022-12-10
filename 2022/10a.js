require('process')

// Bereite dieses Programm auf STDIN / STDOUT Standard vor (nicht wichtig)
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


const optionDefinitions = [
    { name: 'debug', alias: 'd', type: Boolean, defaultValue: false }
]

const commandLineArgs = require('command-line-args');
const { write } = require('fs');
const options = commandLineArgs(optionDefinitions)

    
if (options.debug) {
    console.debugging = true
    console.debug(options)
}

console.debug = function () {
    if (!console.debugging) return;
    console.log.apply(this, arguments);
    console.log("------------------------------------------------")
};

var lines = []
rl.on('line', line => lines.push(line))

rl.on('close', async () => {
    let x = 1;
    let signal_strengths = []

    let write = s => process.stdout.write(s)

    function* cyclerGen() {
        let cycle = 1;

        while (true) {
            let spritePos = Array(40).fill('')
                .map((_,i) => Math.abs(i-x) <= 1 ? '#' : '.').join("")

            if (Math.abs((cycle % 40) - x - 1) <= 1) 
                write('#')
            else 
                write('.')

            // append newline on pixel 40
            if (cycle % 40 == 0) {
                write("\n")
            }

            // calculate signal strength
            if (cycle == 20 || (cycle-20) % 40 == 0) {
                let strength = cycle * x
                signal_strengths.push(strength)
                // console.debug(`Cycle #${cycle}, X = ${x}, signal strength = ${strength}`)
            }

            yield cycle++
        }
    }
    let cycler = cyclerGen()
    let tick = () => cycler.next()
    let command, arg
    
    lines.map(line => {

        [ command, arg ] = line.split(" ")
        // console.debug(`Executing ${command} with arg ${arg}`)
        
        switch (command) {
            case 'noop':
                tick()
                break;

            case 'addx':
                tick()
                tick()
                x += parseInt(arg);
                break;
        }

    })

    let sum = signal_strengths.reduce((acc,_) => acc+=_)
    console.log(`X = ${x}, SUM of signal strengths = ${sum}`)

})
