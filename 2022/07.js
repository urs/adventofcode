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


// Lies den Input der Aufgabe zeilenweise in `lines` Array ein
var lines = []
rl.on('line', x => lines.push(x))
rl.on('close', () => {


  console.debug(lines)

  let isCommandLine = line => line[0] == "$"
  let parseCommand = line => line.split(" ").slice(1)

  let commands = []

  while (line = lines.shift()) {    
    // parse line
    var command = parseCommand(line)
    var output = []

    // read output 
    while (lines.length > 0 && !isCommandLine(lines[0])) {
      output.push(lines.shift())
    }
    
    commands.push({cmd: command[0], args: command.slice(1), out: output})
  }

  // console.debug(commands)


  class TreeNode {
    constructor(name, type, size = undefined) {
      this.name = name
      this.type = type
      this._size = parseInt(size)
      this.parent = undefined
      this.descendants = []
    }

    mkdir(name) {
      let dir = new TreeNode(name, 'dir');
      dir.parent = this
      this.descendants.push(dir)
    }

    descend(name) {
      return this.descendants.find(d => d.name == name && d.type == 'dir')
    }

    ascend() {
      return this.parent
    }

    get folders() {
      if (this.type != 'dir') return undefined;
      return this.descendants.filter(x => x.type == 'dir');
    }

    get files() {
      if (this.type != 'dir') return undefined;
      return this.descendants.filter(x => x.type == 'file');
    }

    filterBySize(cmpFct) {

      let matchingChildren = this.folders.flatMap(f => f.filterBySize(cmpFct)) 

      if (cmpFct(this.size)) {
        return [this, ...matchingChildren]
      } else {
        return matchingChildren
      }
    }

    addFile(name, size) {
      let child = new TreeNode(name, 'file', size);
      this.descendants.push(child)
    }

    get size() {
      if (this.type == 'file') return this._size
      else return this.descendants.reduce((acc, _) => acc += _.size, 0)
    }

    toString (indent = '') {
      return `${indent}- ${this.name} (type: ${this.type}, size: ${this.size})\n${
        this.descendants.reduce((acc, _) => acc+_.toString(indent + '    '), '')}`
    }
  }

  let root = tree = new TreeNode('/', 'dir');

  while (command = commands.shift()) {

    switch(command.cmd) {
      case 'cd':
        let arg = command.args.shift()
        console.debug("Changing dir into", arg)

        if (arg == "..") {
          console.debug("CMD: Ascend")
          tree = tree.ascend()
        } else if (arg == '/') {
          console.debug("CMD: go to root")
          tree = root
        } else {
          console.debug("CMD: Descend into", arg)
          tree = tree.descend(arg)
        }
        console.debug("tree ", tree)
        break;


      case 'ls':
        console.debug("listing directory", command.out)
        command.out.map(line => {
          let [col1, name] = line.split(" ");
          if (col1 == 'dir') {
            tree.mkdir(name)
          } else {
            tree.addFile(name, col1)
          }
        })

        break
    }
  }


  //console.debug(root)
  // console.log(root.toString())

  let spaceTotal = 70000000
  let spaceNeededTotal = 30000000
  let spaceLeft = spaceTotal - root.size
  let spaceMissing = spaceNeededTotal - spaceLeft

  console.log("total: " + spaceTotal)
  console.log("needed: " + spaceNeededTotal)
  console.log("left: " + spaceLeft)
  console.log("missing: " + spaceMissing)

  let folders = root.filterBySize(x => x >= spaceMissing)

  console.log(folders.sort((a,b) => a.size - b.size).map(x => x.name + ", size = " + x.size))

})