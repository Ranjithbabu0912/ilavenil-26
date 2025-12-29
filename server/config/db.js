import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ilavenil",
      bufferCommands: false,
      serverSelectionTimeoutMS: 20000,
    });
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB Connected");
  return cached.conn;
};

export default connectDB;
