const sqlite3 = require("sqlite3")
const express = require ("express")
const app = new express()
app.use(express.json())

const db = new sqlite3.Database('user_data.sqlite3')

db.serialize(()=> {
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT)");
  
    var stmt = db.prepare("INSERT INTO users VALUES (?,?)")
    for (let i = 0; i < 10; i++) {
        stmt.run(`user_${i}`, `pwd_${i}`)
    }
    stmt.finalize()
})

  app.post("/login",(req,res)=>{
    const { user, pwd } = req.body

    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [user, pwd], (err,row)=>{
        if (err) console.log(err)
        else{
            if (row) {
                res.status(200).send({ok: "true"})
            }
            else {
                res.status(401).send({ok: "false"})
            }
        }
    })
})

app.listen(8080,()=>{console.log('server listening on port 8080')})