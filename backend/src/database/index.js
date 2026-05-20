import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// database connection

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
    );
    console.log(
      `\nMongoDB connected !! BD Host: ${connectionInstance.connection.host}`,
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
