/* eslint-disable indent */
const express = require("express")
const engine = require("./engine.js")
const server = express()

server.use(express.static("public"))

server.get("/", (req, res) => {
  res.set("Content-Type", "text/html")
  res.send(engine.load_template("main", {
      nome: "Federico",
      cognome: "Pessina"
  }))
})

// eslint-disable-next-line no-console
server.listen(8000, () => console.log("Server avviato"))