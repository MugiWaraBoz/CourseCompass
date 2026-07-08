const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "../.env"}) // loads .env file

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing. Add it to server/.env before starting the server.");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 5000
});

let database

module.exports = {
    connectToServer: async ()=>{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        database = client.db("CourseCompass")
        console.log("Connected to MongoDB")
    },
    getDb: ()=>{
        return database
    }
}

// console.log("testing")

/*
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/
