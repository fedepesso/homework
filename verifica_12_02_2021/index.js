const express = require("express")
const server = express()
const fetch = require("node-fetch")
server.use(express.json())

server.get("/accreditamento", (req, res) => {
    res.send({
        "nome": "Federico",
        "cognome": "Pessina"
    })
})

server.post("/somma-multipli", (req, res) => {
    const numbers = req.body.numbers
    const n = req.body.n
    const result = numbers.reduce((acc, e) => {
        if (e < n && e % 2 === 0) {
            acc += e
        }
        return acc
    }, 0)
    res.send({result})
})

server.put("/lista-vocali", (req, res) => {
    /*const words = req.body.words
    const result = words.reduce((acc, e) => {
        if (e.length > 5) {
            acc += e + " "
        }
        return acc
    }, "")
    res.send({text: result.slice(0, -1)})*/
    const words = req.body.words
    const c = req.body.char
    const result = words.reduce((acc, e) => {
        if (e.includes(c)) {
            acc += 1
        }
        return acc
    }, 0)
    res.send({n: result})
})

server.post("/comments", async (req, res) => {
    const domain = req.body.domain
    const a_ = await fetch(`https://jsonplaceholder.typicode.com/posts/${req.body.id}/comments`)
    const data = await a_.json()
    let a = 0
    let b = 0
    data.forEach(e => {
        const email = e.email
        if (email.endsWith(domain)) {
            a += 1
        } else {
            b += 1
        }
    })
    res.send({a, b})
})

server.listen(8080, ()=>{console.log("Server avviato")})