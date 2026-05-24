import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000
    });
    console.log("MongoDB Connected Successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

export const getDatabaseStatus = () =>
  mongoose.connection.readyState === 1 ? "connected" : "disconnected";

export default connectDB;
