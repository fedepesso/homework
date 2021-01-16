const express = require("express")
const { fetch } = require("node-fetch")
const utils = require("./utils")
const app = new express()

app.get("/", async (req, res) => {
    try {
        let data = await fetch("https://jsonplaceholder.typicode.com/posts")
        data = await data.json()
        res.send(utils.homepage(data))
    } catch(err) {
        console.error(err)
    }
})

app.get("/posti/:id", (req, res) => {
    try {
        let post_data = await fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}/comments`)
        let comments = await fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`)
        post_data = await post_data.json()
        comments = await comments.json()
        res.send(utils.post_page(post_data, comments))
    } catch(err) {
        console.error(err)
    }
})
