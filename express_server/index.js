const express = require("express")
const handlebars = require("express-handlebars")
const fetch = require('node-fetch')
const server = express()

const color_modes = {
    "light": {
        "background": "#F5F5F5",
        "content": "#E0E0E0",
        "navbar": "#E3F2FD",
        "navbar_text": "light"
    },
    "dark": {
        "background": "#696969",
        "content": "#778899",
        "navbar": "#2F4F4F",
        "navbar_text": "dark"
    }
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
    const user = req.query.user

    if (req.headers["accept-language"].slice(0, 2) === "it") {
        res.render('home_it', {layout: 'default', used_browser: req.headers["user-agent"].split("/")[0], palette: color_modes[req.query.background], user})
    } else {
        res.render('home_en', {layout: 'default', used_browser: req.headers["user-agent"].split("/")[0], palette: color_modes[req.query.background], user})
    }
    
})

server.get("/quotes", (req, res) => {
    fetch(`https://api.tronalddump.io/search/quote?tag=${req.query.tag}`)
    .then(response => response.json())
    .then(response => {
        if (req.headers["accept-language"].slice(0, 2) === "it") {
            res.render("opinion_it", {layout: 'default', search_term:req.query.tag, palette: color_modes[req.query.background], quotes: response._embedded.quotes})
        } else {
            res.render("opinion_en", {layout: 'default', search_term:req.query.tag, palette: color_modes[req.query.background], quotes: response._embedded.quotes})
        }
    })
})

server.listen(3000, () => console.log("Server avviato"))