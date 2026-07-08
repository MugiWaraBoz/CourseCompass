require("dotenv").config({path: "../.env"}) // loads .env file

const connect = require("./config/connect") // runs connect.js
const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.API_PORT || 5000

app.use(cors())
app.use(express.json())

connect.connectToServer().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running! on port ${PORT}`)
    }) // creates the server
}).catch((error)=>{
    console.error("Failed to connect to database", error)
    process.exit(1)
})
