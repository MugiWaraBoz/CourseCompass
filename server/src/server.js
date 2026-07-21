require("dotenv").config() // loads .env file

const connect = require("./config/connect") // runs connect.js
const app = require("./app") // runs app.js

const PORT = 3000

app.listen(PORT, ()=>{
    try {
        connect.connectToServer()
        connect.createIndexes()
        console.log(`
            -> Server is running on port ${PORT}, 
            -> connected to database: ${connect.getDb().databaseName}`)
    } catch (err) {
        console.error("Error connecting to database: ", err)
    }
})
