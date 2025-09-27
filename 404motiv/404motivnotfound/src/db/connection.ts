import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://ommayekar32_db_user:us7J9K9fUkx9eL9O@cluster0.rzjv7ah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    return client.db("recycling-platform");
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    throw error;
  }
}

export async function closeConnection() {
  await client.close();
}