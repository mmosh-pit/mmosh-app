import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;

const client = new MongoClient(uri);

client.connect();

export const db = client.db(process.env.DATABASE_NAME!);
