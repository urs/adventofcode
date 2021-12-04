var r = require("ramda");

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const BIT_ZERO = '0'
const BIT_ONE  = '1'

var lines = []
rl.on('line', x => lines.push(x))
rl.on('close', () => {
    var countBits= (list, bit) => {
        return list
            .map(x => x[bit])
            .reduce((prev, cur) => { return prev + (cur == BIT_ZERO ? -1 : 1) },0)
    }

    var findMostCommonBit = count => count >= 0 ? BIT_ONE : BIT_ZERO
    var findLeastCommonBit = count => count < 0 ? BIT_ONE : BIT_ZERO

    var oxy_lines = lines;
    var co2_lines = lines;
    var i = 0;
    do {
        oxy_lines = oxy_lines.filter(x => x[i] == findMostCommonBit(countBits(oxy_lines, i)))
        i++
    } while (oxy_lines.length > 1)
    var i = 0;
    do {
        co2_lines = co2_lines.filter(x => x[i] == findLeastCommonBit(countBits(co2_lines, i)))
        i++
    } while (co2_lines.length > 1)

    var oxygen = parseInt(oxy_lines, 2)
    var co2 = parseInt(co2_lines, 2)

    console.log("oxygen: " + oxygen)
    console.log("co2scrub: " + co2)
    console.log("multiplied: " + (oxygen*co2))
    console.log("Fertig")
})
