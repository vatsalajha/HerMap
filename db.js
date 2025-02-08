const { MongoClient } = require('mongodb');

// Replace with your actual credentials
const username = "vj193";
// const password = "Rutgers@2025";
const password = "Rutgers%402025";
const uri = `mongodb+srv://<db_username>:<db_password>@hackhers.lwqyd.mongodb.net/?retryWrites=true&w=majority&appName=Hackhers`;
// mongodb+srv://vj193:Rutgers@2025@hackhers.lwqyd.mongodb.net/?retryWrites=true&w=majority&appName=Hackhers
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
        return client.db('hackhers');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = { connectToDatabase };