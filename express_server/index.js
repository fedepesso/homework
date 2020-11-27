const express = require("express")
const handlebars = require("express-handlebars")
const fetch = require("node-fetch")
const server = express()

const color_modes = {
  light: {
    background: "#F5F5F5",
    content: "#E0E0E0",
    navbar: "#E3F2FD",
    navbar_text: "light",
    button_style: "dark"
  },
  dark: {
    background: "#696969",
    content: "#778899",
    navbar: "#2F4F4F",
    navbar_text: "dark",
    button_style: "light"
  },
  null: {
    background: "#F5F5F5",
    content: "#E0E0E0",
    navbar: "#E3F2FD",
    navbar_text: "light",
    button_style: "dark"
  }
}

const search_palette = val => {
  if (val === undefined) { 
    return color_modes["light"] 
  }
  if (color_modes[val] === undefined) {
    return color_modes["light"] 
  }
  return color_modes[val]
}

server.use(express.static("public"))

server.set("view engine", "hbs")
server.engine("hbs", handlebars({
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials/",
  extname: "hbs"
})
)

server.get("/", (req, res) => {
  let user = req.query.user
  if (user === undefined || user === "null") {
    user = "ti_sei_dimenticato_il_nome_utente"
  }

  if (req.headers["accept-language"].slice(0, 2) === "it") {
    res.render("home_it", { layout: "default", used_browser: req.headers["user-agent"], palette: search_palette(req.query.background), user })
  } else {
    res.render("home_en", { layout: "default", used_browser: req.headers["user-agent"], palette: search_palette(req.query.background), user })
  }
})

server.get("/quotes", (req, res) => {
  fetch(`https://api.tronalddump.io/search/quote?tag=${req.query.tag}`)
    .then(response => response.json())
    .then(response => {
      if (response.status === 404) {
        res.render("redirect", { layout: "default", search_term:req.query.tag, palette: search_palette(req.query.background) })
      }
      
      const quotes = response._embedded.quotes.map(val => { 
        val.appeared_at = val.appeared_at.slice(0, 10)
        return val
      })
      
      if (req.headers["accept-language"].slice(0, 2) === "it") {
        res.render("opinion_it", { layout: "default", search_term:req.query.tag, palette: search_palette(req.query.background), quotes })
      } else {
        res.render("opinion_en", { layout: "default", search_term:req.query.tag, palette: search_palette(req.query.background), quotes })
      }
    })
})

// eslint-disable-next-line no-console
server.listen(8000, () => console.log("Server avviato"))