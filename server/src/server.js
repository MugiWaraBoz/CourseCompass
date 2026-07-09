require("dotenv").config() // loads .env file

const connect = require("./config/connect") // runs connect.js
const express = require("express")
const cors = require("cors")

// Routes
const auth = require("./routes/authRoutes")
const course = require("./routes/courseRoutes")
const faculty = require("./routes/facultyRoutes")
const student = require("./routes/studentRoutes")
const review = require("./routes/reviewRoutes")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// routes use
app.use("/auth", auth)
app.use("/courses", course)
app.use("/faculty", faculty)
app.use("/students", student)
app.use("/reviews", review)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})
