const express = require("express")
const server = new express()

const field = []
const ships = []
const W = process.argv[2] || 10
const H = process.argv[3] || 10
const S = process.argv[4] || 5

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
        }
        return "~"
    }
    return "~"
}

for (let y = 0; y < H; y++) {
    const row = []
    for (let x = 0; x < W; x++) {
        row.push({
            team: null,
            x,
            y,
            ship: null,
            hit: true
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
        killTeam: null
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
        ships.map(e => {
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
        res.send({field})
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
    res.json({x, y, team})
})

server.get("/score", (req, res) => {
    res.json([])
})

server.all("*", (req, res) => {
    res.sendStatus(404)
})

server.listen(8080, () => console.log("Server aperto sulla porta 8080"))
