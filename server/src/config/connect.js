const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "../.env"}) // loads .env file

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is missing. Add it to server/.env before starting the server.");
}

const client = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database

module.exports = {
    connectToServer: ()=>{
        // database = client.db("CourseCompass")
        database = client.db("TestDB")
    },
    getDb: ()=>{
        return database
    },
    closeDatabase: () => {
        return client.close();
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
