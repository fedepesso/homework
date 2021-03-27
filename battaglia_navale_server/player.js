const fetch = require("node-fetch")

const team = process.argv[2] || "prova_team"
const pwd = process.argv[3] || "prova_pwd"
const url = process.argv[4] || "http://localhost:8080"

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const main = async function() {
    fetch(`${url}/registrazione?team=${team}&pwd=${pwd}`)
    let map = await fetch(`${url}/get-snapshot?format=json`)
    map = await map.json()
    const W = map[0].length
    const H = map.length
    
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            let result = await fetch(`${url}/attack?x=${x}&y=${y}&team=${team}&pwd=${pwd}`)
            result = await result.json()
            console.log(result)
            await sleep(1000)
        }
    }
}

main()