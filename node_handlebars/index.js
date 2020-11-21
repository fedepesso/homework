const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch');
const server = express()

fakeApi = () => {
    return [
      { name: 'Katarina', lane: 'midlaner'},
      { name: 'Jayce', lane: 'toplaner' },
      { name: 'Heimerdinger', lane: 'toplaner' },
      { name: 'Zed', lane: 'midlaner' },
      { name: 'Azir', lane: 'midlaner' }
    ]
  }

server.use(express.static('public'))

server.set('view engine', 'hbs')
server.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    defaultLayout: 'planB',
    extname: 'hbs',
    helpers: {
      prova_block_helper: function(testo) { return '<h2>risultato di un block helper: ' + testo.fn(this) + '</h2>' },
      prova_helper_partial: (conditional, val) => { if (conditional) {return val.fn(this)} },
      prova_helper_normale: (val_1, val_2) => { if (val_1) { return val_2 } }
      }
    }
  )
)

server.get('/', (req, res) => {
    fetch('https://api.cryptonator.com/api/ticker/DOGE-usd')
    .then(response => response.json())
    .then(response => {
        res.render('main', {
            layout: 'index', 
            dogecoin: response,
            suggestedChamps: fakeApi(),
            listExists: true,
            partial_data: "prova",
            ciao: "ciao"
        })
    })
})

server.listen(3000, () => console.log('Server avviato'))