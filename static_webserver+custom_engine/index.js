/* eslint-disable indent */
const express = require("express")
const engine = require("./engine.js")
const server = express()

server.use(express.static("public"))

engine.add_helper("spawn_list", arr => {
    let result = "<ul>"
    arr.forEach(el => {
        result = result + "<li>" + el + "</li>"
    })
    return result + "</ul>"
})

server.get("/", (req, res) => {
  res.set("Content-Type", "text/html")
  res.send(engine.render_template("main", {
      nome: "Federico",
      cognome: "Pessina",
      valore_da_processare: "ciao",
      example_array: ["elemento_1", "elemento_2", "elemento_3"]
  }))
})

// eslint-disable-next-line no-console
server.listen(8000, () => console.log("Server avviato"))