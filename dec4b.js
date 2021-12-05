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

    var numbers = lines.shift().split(",").map(x => parseInt(x))

    var boards = lines.reduce((prev, value) => {
        if (value == "") { prev.push([]) }
        else { prev[prev.length-1].push(value.trim().split(/\s+/).map(x => parseInt(x))) }
        return prev
    }, [])

    console.log(numbers)

    var markInBoard = (value, board) => {
        return board.map(row => row.map(number => {
            return number == value ? 'x' : number
        }))
    }

    var transpose = matrix => {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

    var bingoMatcher = row => row.join("") == "xxxxx"
    var checkBoard = board => {
        var rowMatch = board.find(bingoMatcher)
        var transposed = transpose(board)
        var colMatch = transposed.find(bingoMatcher)
        return rowMatch || colMatch
    }

    var calcBoardSum = board => {
        return board.flat().filter(x => x != 'x').reduce((t,v) => t += v)
    }

    console.log("BOARDS")
    console.log(boards)
    numbers.forEach(val => {
        console.debug("MARKING", val)
        var markVal = board => markInBoard(val, board)
        boards = boards.map(markVal)


        console.log("noch boards übrig", boards.length)
        console.log(boards)
        if (boards.length > 1) {
            boards = boards.filter(board => !checkBoard(board))
        }
        else if (checkBoard(boards[0])) {
            var score = calcBoardSum(boards[0]) * val
            console.log("last one won", score)
            process.exit(1)
        }

    })

    console.log(boards)
    console.log("Fertig")
})
