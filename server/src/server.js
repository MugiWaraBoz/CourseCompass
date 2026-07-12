require("dotenv").config() // loads .env file

const connect = require("./config/connect") // runs connect.js
const app = require("./app") // runs app.js

const PORT = 3000

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`
        -> Server is running on port ${PORT}, 
        -> connected to database: ${connect.getDb().databaseName}`)
})
