var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var lines = []
rl.on('line', x => lines.push(x))
rl.on('close', () => {

    var threshold = parseInt( lines.length / 2)

    var result = []
    var count = x => {
        x.split('').forEach((bit, i) => {
            result[i] = parseInt(bit) + (result[i] ?? 0)
        });
    }

    var calcGamma = x => {
    var g = "";
        x.forEach((a, i) => {
                g += a >= threshold ? '1' : '0'
                })
        return parseInt(g, 2)
    }

    var calcEpsilon = x => {
        var e = ""
            x.forEach((a,i) => {
                    e += a < threshold ? '1' : '0'
                    })
        return parseInt(e, 2)
    }

    lines.map(count)
        var gamma = calcGamma(result)
        var epsilon = calcEpsilon(result)

        console.log("gamma: " + gamma)
        console.log("epsilon: " + epsilon)
        console.log("multiplied: " + (gamma * epsilon))

        console.log("Fertig")
})
