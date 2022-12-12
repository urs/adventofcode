require('process')

// Bereite dieses Programm auf STDIN / STDOUT Standard vor (nicht wichtig)
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


const optionDefinitions = [
    { name: 'debug', alias: 'd', type: Boolean, defaultValue: false },
    { name: 'rounds', alias: 'r', type: Number, defaultValue: 1 },
    { name: 'norelief', type: Boolean, defaultValue: false }
]

const commandLineArgs = require('command-line-args');
const { write } = require('fs');
const { inspect } = require('util');
const { notStrictEqual } = require('assert');
const { getUnpackedSettings } = require('http2');
const options = commandLineArgs(optionDefinitions)

    
if (options.debug) {
    console.debugging = true
    console.debug(options)
}

console.debug = function () {
    if (!console.debugging) return;
    console.log.apply(this, arguments);
};

var lines = []
rl.on('line', line => lines.push(line))

rl.on('close', async () => {
    
    let notes = lines.join("\n");
    lines = undefined

    let pattern = new RegExp(
        'Monkey (?<monkey>\\d+):\n' + 
        '  Starting items: (?<items>[\\d, ]+)\n' + 
        '  Operation: new = (?<op>.+)\n' + 
        '  Test: divisible by (?<test>\\d+)\n' + 
        '    If true: throw to monkey (?<truthy>\\d+)\n' + 
        '    If false: throw to monkey (?<falsy>\\d+)', 'g'
    )

    let throwTo = (monkey, item) => {
        console.debug(`Item with worry level ${item} is thrown to monkey ${monkey}`)
        monkeys.find(m => m.id == monkey).items.push(item)
    }

    class Monkey {

        constructor({ id, items, op, test, truthy, falsy}) {
            this.id     = id
            this.items  = items
            this.op     = (old) => eval(op)
            this.modulo = test
            this.test   = (x) => x % parseInt(test) == 0
            this.truthy = (x) => throwTo(truthy, x)
            this.falsy  = (x) => throwTo(falsy, x)
            this.inspections = 0;
        }

        inspectItems () {
            console.debug(`Monkey ${this.id}:`)
            let item
            while(item = this.items.shift()) {
            
                // inspepct
                this.inspections++;
                console.debug(`  Monkey inspects an item with a worry level of ${item}.`)
                
                console.debug(`    Worry level goes from ${item} to ${this.op(item)}.`)
                item = this.op(item)
                
                // Relief
                if (!options.norelief) {
                    item = Math.floor(item / 3)
                    console.debug(`    Monkey gets bored with item. Worry level is divided by 3 to ${item}`)
                } else {
                    item = item % supermodulo
                }
  
                // Test
                if (this.test(item)) {
                    console.debug(`    Current worry level is divisible`)
                    this.truthy(item)
                } else {
                    console.debug(`    Current worry level is NOT divisible`)
                    this.falsy(item)
                }
            }
        }
    }

    let monkeys = [...notes.matchAll(pattern)]
        .map(x => x.groups).map(obj => { 
            return new Monkey({
                id: parseInt(obj.monkey),
                items: obj.items.split(",").map(x => parseInt(x)),
                op: obj.op,
                test: obj.test,
                truthy: parseInt(obj.truthy),
                falsy: parseInt(obj.falsy),
            })
        })

    // console.log(monkeys)

    let supermodulo = monkeys.reduce((acc, _) => acc * _.modulo, 1)
    
    // n round simulator
    for (let r = 0; r < options.rounds; r++) {
        console.debug("")
        console.log(`Round ${r}`)
        console.debug("==========")

        // Take turns
        // console.time(`inspection round ${r}`)
        monkeys.map(m => m.inspectItems())
        // console.timeEnd(`inspection round ${r}`)
        
        console.debug("")
        monkeys.map(m => console.debug(`Monkey ${m.id}: ${m.items}`))
    }


    console.debug("")
    monkeys.map(m => console.log(
        `Monkey ${m.id}: inspected items ${m.inspections} times`
    ))

    console.log(
        monkeys
            .sort((a,b) => b.inspections - a.inspections)
            .slice(0, 2)
            .reduce((acc,_) => acc*=_.inspections, 1)
    )
    
    

})
