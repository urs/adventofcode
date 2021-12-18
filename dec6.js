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

    const RESET_AFTER_BIRTH = 6
    const AGE_NEWBORN = 8
    const AGE_ADULT = 6

    console.log("initial state:",state)

    let pop = [
        { age: 0, amount: 0},
        { age: 1, amount: 0},
        { age: 2, amount: 0},
        { age: 3, amount: 0},
        { age: 4, amount: 0},
        { age: 5, amount: 0},
        { age: 6, amount: 0},
    ]

    state.reduce((pop, age) => {
        return pop.map(x => {
            if (x.age == age) x.amount++
            return x
        })
    }, pop)

    let newDay = pop => {
        // give birth
        let newBorn = pop // based on current population
            .filter(x => x.age == 0 && x.amount > 0) // find out which item produces new items
            .map(x => { return { age: AGE_NEWBORN, amount: x.amount }}) // each one produces one
        console.log("NewBorn", newBorn)

        // age the population and reset after birth
        pop.map(x => {
            x.age--
            x.age < 0 ? x.age = RESET_AFTER_BIRTH : null
            return x
        });

        pop = pop.concat(newBorn)

        // consolidate existing and newborn
        pop = pop.reduce((newPop, cur) => {

            let prevAgeFilter = x => x.age == cur.age
            let hasAge = newPop.filter(prevAgeFilter).length > 0
            if (hasAge) 
                newPop.filter(prevAgeFilter)
                    .map(x => x.amount += cur.amount);
            else newPop.push(cur)

            return newPop
        }, [])

        return pop
    }

    console.log(pop)
    for (let i = 1; i <= 256; i++) {
        console.log("--------- new day ---------")
        pop = newDay(pop)
        console.log(`after ${i} days: `, pop)
    }

    console.log(`Amount:`, pop.reduce((prev, cur) => prev + cur.amount, 0))
    console.log("Fertig")

})
