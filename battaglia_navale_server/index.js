const express = require("express")
const server = new express()

let field = []
let ships = []
let leaderboard = {}
let fetch_table = {}
let active = true

const W = process.argv[2] || 10
const H = process.argv[3] || 10
const S = process.argv[4] || 5
const DEBUG_VIEW = Boolean(process.argv[5] || 1)

const randint = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const verify_intersection = function(x_a, y_a, w_a, h_a, x_b, y_b, w_b, h_b) {
    return x_a + w_a >= x_b && x_a <= x_b + w_b && y_a <= y_b + h_b && y_a + h_a >= y_b
}

const define_char = function(cell) {
    if (cell.ship) {
        if (cell.hit) {
            return "X"
        } else {
            if (DEBUG_VIEW) {
                return "[]"
            } else {
                return "~"
            }
        }
        
    }
    return "~"
}

const check_status = function() {
    let concluded = true
    ships.forEach(e => {
        if (e.alive) {
            concluded = false
        }
    })
    return !concluded
}

for (let y = 0; y < H; y++) {
    const row = []
    for (let x = 0; x < W; x++) {
        row.push({
            team: null,
            ship: null,
            hit: false
        })
    }
    field.push(row)
}

for (let i = 0; i < S; i++) {
    const ship = {
        id: `ship_${i}`,
        x: undefined,
        y: undefined,
        w: undefined,
        h: undefined,
        curHp: undefined,
        alive: true,
    }

    let gen_attempts = 0
    while (gen_attempts < 50) {
        if (randint(0, 1)) {
            ship.w = 1
            ship.h = randint(2, 5)
        } else {
            ship.w = randint(2, 5)
            ship.h = 1
        }
        ship.x = randint(0, W - ship.w - 1)
        ship.y = randint(0, H - ship.h - 1)
        ship.curHp = ship.w * ship.h

        let validated = true
        ships.forEach(e => {
            if (verify_intersection(ship.x, ship.y, ship.w, ship.h, e.x, e.y, e.w, e.h)) {
                validated = false
            }
        })

        if (validated) {
            // console.log(ship)
            ships.push(ship)
            for (let x = ship.x; x < ship.x + ship.w; x++) {
                for (let y = ship.y; y < ship.y + ship.h; y++) {
                    field[y][x].ship = ship
                }
            }
            break
        } else {
            // console.log("viaaaa")
            gen_attempts += 1
        }
    }
}

server.get("/get-snapshot", ({ query: { format} }, res) => {
    if (format === "json") {
        let public_field = []
        for (let y = 0; y < H; y++) {
            const row = []
            for (let x = 0; x < W; x++) {
                row.push({char: define_char(field[y][x]), hit: field[y][x].hit})
            }
            public_field.push(row)
        }
        res.send(public_field)
    } else {
        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>battaglia navale</title>
        <style>
            table, td, th {
            border: 1px solid black;
            }
            table {
            width: 90%;
            border-collapse: collapse;
            layout: fixed;
            }
        </style>
        </head>
        <body>
        <table>
            <tbody>
            ${field.map(row => `<tr>${row.map(cell => `<td>${define_char(cell)}</td>`).join("")}</tr>`).join("")}
            </tbody>
        </table>
        </body>
        </html>
        `)
    }
})

server.get("/attack", ({ query: { x, y, team } }, res) => {
    if (!active) {
        res.send("La partita è finita: chiama /score per vedere la classifica finale.")
        return undefined
    }
    if (x < 0 || y < 0 || x > W - 1 || y > H - 1) {
        leaderboard[team] += -5
        res.status(400).send({"hit": false, x, y, gain: -5})
        return undefined
    }
    if (fetch_table[team]) {
        if (Date.now() - fetch_table[team] < 1000) {
            res.status(403).send(`Esaurito il numero di richieste massimo per unità di tempo`)
            return undefined
        } else {
            fetch_table[team] = Date.now()
        }
    } else {
        fetch_table[team] = Date.now()
    }

    if (!leaderboard[team]) {
        leaderboard[team] = 0
    }

    if (field[y][x].ship) {
        const ship = field[y][x].ship
        if (ship.alive) {
            if (!field[y][x].hit) {
                field[y][x].hit = true
                field[y][x].team = team
                ship.curHp -= 1
    
                if (ship.curHp === 0) {
                    ship.alive = false
                    leaderboard[team] += ship.w * ship.h
                    active = check_status()
                    res.send({"hit": true, x, y, gain: ship.w*ship.h})
                } else {
                    leaderboard[team] += 1
                    res.send({"hit": true, x, y, gain: 1})
                }
            } else {
                leaderboard[team] += -1
                res.send({"hit": false, x, y, gain: -1})
            }
        }
    } else {
        if (field[y][x].hit) {
            leaderboard[team] += -1
                res.send({"hit": false, x, y, gain: -1})
        } else {
            res.send({"hit": false, x, y, gain: 0})
        }
    }
})

server.get("/score", (req, res) => {
    res.json(leaderboard)
})

server.all("*", (req, res) => {
    res.sendStatus(404)
})

server.listen(8080, () => console.log("Server aperto sulla porta 8080"))
