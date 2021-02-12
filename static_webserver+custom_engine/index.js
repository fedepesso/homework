/* eslint-disable no-console */
const express = require("express")
const engine = require("./engine.js")
const server = express()

server.use(express.static("public"))

engine.modify_settings({
  file_extension: ".tpl",
  templates_directory: "/templates/"
})

engine.add_helpers({
  spawn_list: arr => {
    let result = ""
    arr.forEach(el => {
      result = result + "<li>" + el + "</li>"
    })
    return result
  },
  saluta_vigorosamente: val => "Ciao " + val + "!!!!!"
})

server.get("/", (req, res) => {
  const nome_utente = req.query.user
  res.set("Content-Type", "text/html")
  res.send(engine.render_template("main", {
    nome_utente,
    titolo: "Pagina renderizzata",
    example_array: ["elemento_1", "elemento_2", "elemento_3"]
  }))
})

server.listen(8000, () => console.log("Server avviato"))