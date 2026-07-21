const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "../.env"}) // loads .env file

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is missing. Add it to server/.env before starting the server.");
}


let client
let database

module.exports = {
    connectToServer: ()=>{
        // database = client.db("CourseCompass")
        client = new MongoClient(process.env.MONGO_URL, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        });
        database = client.db(process.env.DB_NAME)
    },
    getDb: ()=>{
        return database
    },
    closeDatabase: () => {
        return client.close();
    },
    createIndexes: async () => {
      /*
        Create indexes for the collections to enforce uniqueness 
        and improve query performance.
      */
      const db = database;

      await db.collection("Vote").createIndex(
        {
          studentId: 1,
          reviewId: 1,
        },
        {
          unique: true,
        }
      )

      await db.collection("Review").createIndex(
        {
          studentId: 1,
          courseId: 1,
          facultyId: 1,
        },
        {
          unique: true,
        }
      )
      
      await db.collection("Student").createIndex(
        {
          email: 1,
        },
        {
          unique: true,
        }
      )

      await db.collection("Student").createIndex(
        {
          studentIdNumber: 1,
        },
        {
          unique: true,
        }
      )

      await db.collection("Course").createIndex(
        {
          code: 1,
        },
        {
          unique: true,
        }
      )

      await db.collection("CourseTake").createIndex(
        {
          facultyId: 1,
          courseId: 1,
        },
        {
          unique: true,
        }
      )

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
