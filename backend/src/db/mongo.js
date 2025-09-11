// src/server/db/mongo.ts
// import mongoose from "mongoose";

// let conn: typeof mongoose | null = null;

// export async function connectMongo() {
//   const uri = process.env.MONGODB_URI!;
//   const dbName = process.env.MONGO_DB || "schedules";
//   if (!uri) throw new Error("MONGODB_URI is missing");

//   if (conn) return conn;
//   conn = await mongoose.connect(uri, { dbName });
//   return conn;
// }

// mongo.js
const mongoose = require("mongoose");

let connPromise = null;

async function connectMongo() {
  if (connPromise) return connPromise;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGO_DB || "schedules";
  if (!uri) throw new Error("Missing MONGODB_URI");

  connPromise = mongoose.connect(uri, { dbName }).then((m) => {
    console.log(`[mongo] connected db=${dbName}`);
    return m;
  });
  return connPromise;
}

module.exports = { connectMongo, mongoose };
