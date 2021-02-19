/* eslint-disable no-console */
const sqlite3 = require("sqlite3")
// const fetch = require("node-fetch")
const express = require ("express")
const app = new express()
app.use(express.json())

const db = new sqlite3.Database("data.sqlite3")

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS calls (origin_ip TEXT, date TEXT)")
})

app.get("/call-count", (req, res) => {
  db.run("INSERT INTO calls (origin_ip, date) VALUES (?, ?)", [req.ip, new Date().toISOString()], (err) => {
    if (err) {
      console.log(err)
    }
  })

  db.all("SELECT * FROM calls WHERE origin_ip = ?", [req.ip], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send({ data: row })
    }
  })
})

/* app.get("/f", (req, res) => {
  console.log("gg")
  fetch("http://192.168.1.206:8080/f").then(_ => false).catch(console.log)
  res.status(200).send({ ok: "true" })
})*/

app.listen(8080, () => {
  console.log("server listening on port 8080")
})