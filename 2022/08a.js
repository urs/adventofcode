require('process')

// Bereite dieses Programm auf STDIN / STDOUT Standard vor (nicht wichtig)
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const myArgs = process.argv.slice(2);
switch (myArgs[0]) {
  case '--debug':
    console.debugging = true
    break;
}

console.debug = function () {
    if (!console.debugging) return;
    console.log.apply(this, arguments);
    console.log("------------------------------------------------")
};


var trees = []
rl.on('line', x => trees.push(Array.from(x).map(x => parseInt(x))))
rl.on('close', () => {


  let matrixTranspose =  array => {
    return array[0].map((val, index) => array.map(row => row[index]))
  }


  // console.table(trees)


  let isVisible = (height, row, col, trees) => {

    // console.log("checking visibility for", height, "on row",row,"and col",col)

    let allShorterThan = (trees, height) => {
      // console.log(trees)
      if (!trees.length) return true
      return trees.find(t => t >= height) == undefined
    }
    
    let mTrees = matrixTranspose(trees);
    let trees_r = trees[row].slice(col + 1)
    let trees_l = trees[row].slice(0, col)
    let trees_t = mTrees[col].slice(0, row)
    let trees_b = mTrees[col].slice(row + 1)

    // visibility from directions
    let fromRight  = allShorterThan(trees_r, height) ? 'r' : '_'
    let fromLeft   = allShorterThan(trees_l, height) ? 'l' : '_'
    let fromTop    = allShorterThan(trees_t, height) ? 't' : '_'
    let fromBottom = allShorterThan(trees_b, height) ? 'b' : '_'

    if (row == 97 && col == 1)
      console.debug (
        trees_r, trees_l, trees_t, trees_b,
        `height: ${height} (${row}/${col}): ${fromLeft}${fromTop}${fromRight}${fromBottom}`
        
    )
    
    return `${fromLeft}${fromTop}${fromRight}${fromBottom}`
  }

  // evaluate visibility for the whole map
  let visibility = []
  for (let rowIndex = 0; rowIndex < trees.length; rowIndex++) {
    let row = trees[rowIndex]
    visibility[rowIndex] = []
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      let height = row[colIndex]
      visibility[rowIndex][colIndex] = isVisible(height, rowIndex, colIndex, trees)
    }
  }

  // console.table(visibility)


  let visibilityMap = visibility.map(
    x => x.map(
      y => (y != "____")?"1":" "
    ).join("")
  ).join("\n")
  // console.log(visibilityMap)

  console.log((visibilityMap.match(/1/g) || []).length)

})
