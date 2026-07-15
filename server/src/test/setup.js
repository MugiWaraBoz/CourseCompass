const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env.test"),
  quiet: true,
})

const database = require("../config/connect")
const { seedDB, clearDB } = require("./seed.js")


/*
    this beforeAll hook is used to set up the testing environment 
    before any tests are run.
*/
beforeAll(async () => {
    process.env.NODE_ENV = "test"
    process.env.MONGO_URL = 
        "mongodb://localhost:27017/MyLocalDatabase"

    await database.connectToServer()
})


beforeEach(async () => {
    await clearDB()
    await seedDB()
})

afterAll(async () => {
    const db = database.getDb()
    await db.dropDatabase()
    await database.closeDatabase()
})