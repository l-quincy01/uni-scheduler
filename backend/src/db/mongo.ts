import "dotenv/config";
import mongoose, { Mongoose } from "mongoose";

let connPromise: Promise<Mongoose> | null = null;

export async function connectMongo(): Promise<Mongoose> {
  if (connPromise) return connPromise;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGO_DB || "schedules";

  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  connPromise = mongoose
    .connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 5000,
    })
    .then((m) => {
      console.log(`[mongo] connected db=${dbName}`);
      return m;
    });

  return connPromise;
}

export { mongoose };
