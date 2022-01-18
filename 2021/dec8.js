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

    let input = lines.map(line => {
        let lineparts  = line.split(" | ")
        return {
            observations: lineparts[0].split(" ").map(chars => chars.split("").sort().join("")),
            toDecode: lineparts[1].split(" ").map(chars => chars.split("").sort().join(""))
        }
    })

//       0:      1:      2:      3:      4:
//      aaaa    ....    aaaa    aaaa    ....
//     b    c  .    c  .    c  .    c  b    c
//     b    c  .    c  .    c  .    c  b    c
//      ....    ....    dddd    dddd    dddd
//     e    f  .    f  e    .  .    f  .    f
//     e    f  .    f  e    .  .    f  .    f
//      gggg    ....    gggg    gggg    ....
// 
//       5:      6:      7:      8:      9:
//      aaaa    aaaa    aaaa    aaaa    aaaa
//     b    .  b    .  .    c  b    c  b    c
//     b    .  b    .  .    c  b    c  b    c
//      dddd    dddd    ....    dddd    dddd
//     .    f  e    f  .    f  e    f  .    f
//     .    f  e    f  .    f  e    f  .    f
//      gggg    gggg    ....    gggg    gggg

    let display = []
    const A = "oben"
    const B = "obenlinks"
    const C = "rechts1"
    const F = "rechts2"

    let decodeLine = line => {
        console.log(line)

        line.observations.sort((a,b) => b.length - a.length)

        let obs = line.observations;
        console.log(obs)

        // line.observations[0] == 1 (2 Segmente)
        digit_one = obs.pop()
        console.log(digit_one)

        // line.observations[1] == 7 (3 Segmente)
        // line.observations[2] == 4 (4 Segmente)

        // line.observations[3] == (5 Segmente)
        // line.observations[4] == (5 Segmente)
        // line.observations[5] == (5 Segmente)

        // line.observations[6] == (6 Segmente)
        // line.observations[7] == (6 Segmente)
        // line.observations[8] == (6 Segmente)

        // line.observations[9] == 8 alles leuchtet


        line.observations.map(obs => {


            if (obs.length == 2) {
                display[C] = obs[0]
                display[F] = obs[1]
            }

            if (obs.length == 3) {
                display[A] = obs[0]
            }

        })

        return "x x x x"
    }

    let decode = code => {
        if (code.length == 2) {
            return 1
        } 
        return
    }

    decodeLine(input[0])

    console.log(display)

    console.log("Fertig")

})
