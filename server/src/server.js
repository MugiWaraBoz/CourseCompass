require('dotenv').config({ quiet: true }); // loads .env file
// console.log('MONGO_URL:', process.env.MONGO_URL); // Log the MONGO_URL to verify it's loaded
const connect = require('./config/connect'); // runs connect.js
const app = require('./app'); // runs app.js

const PORT = process.env.API_PORT || 3000;

const startServer = async () => {
  try {
    
    await connect.connectToServer(process.env.MONGO_URL, process.env.DB_NAME);
    await connect.createIndexes();
    console.log(`
            -> Server is running on port ${PORT}, 
            -> connected to database: ${connect.getDb().databaseName}`);
    app.listen(PORT)
  } catch (err) {
    console.error('Error connecting to database: ', err);
  }
}

startServer();