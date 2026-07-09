require("dotenv").config() // loads .env file

const connect = require("./config/connect") // runs connect.js
const express = require("express")
const cors = require("cors")

// Routes
// const auth = require("./routes/authRoutes")
const course = require("./routes/courseRoutes")
const faculty = require("./routes/facultyRoutes")
// const user = require("./routes/userRoutes")
// const review = require("./routes/reviewRoutes")
// const votes = require("./routes/voteRoutes")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// routes use
// app.use(auth)
app.use(course)
app.use(faculty)
// app.use(user)
// app.use(review)
// app.use(votes)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})
