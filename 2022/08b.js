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


  console.table(trees)


  let scenicScore = (height, row, col, trees) => {

    let mTrees = matrixTranspose(trees);
    let trees_r = trees[row].slice(col + 1)
    let trees_l = trees[row].slice(0, col).reverse()
    let trees_t = mTrees[col].slice(0, row).reverse()
    let trees_b = mTrees[col].slice(row + 1)

    if (row==1&&col==2)
        console.debug(trees_l)

    let viewingDistance = (treeList, h) => {
        let distance = treeList.findIndex(x => x >= h)

        if (distance == -1) return treeList.length
        return distance+1

    }

    let r = viewingDistance(trees_r, height)
    let l = viewingDistance(trees_l, height)
    let t = viewingDistance(trees_t, height)
    let b = viewingDistance(trees_b, height)

    if (row == 97 && col == 1) {
        console.log(trees_r.findIndex(x => x >= height))

    }

    // return `${t}*${r}*${b}*${l}`
    return t*r*b*l
  }

  // evaluate visibility for the whole map
  let scenicScoreMap = []
  for (let rowIndex = 0; rowIndex < trees.length; rowIndex++) {
    let row = trees[rowIndex]
    scenicScoreMap[rowIndex] = []
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      let height = row[colIndex]
      scenicScoreMap[rowIndex][colIndex] = scenicScore(height, rowIndex, colIndex, trees)
    }
  }

  console.table(scenicScoreMap)


   console.log(Math.max(...scenicScoreMap.flat()))

})
