import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri =
      typeof Deno !== "undefined"
        ? Deno.env.get("MONGODB_URL")
        : process.env.MONGODB_URL;

    console.log("URI defined:", !!uri);

    const connectionInstance = await mongoose.connect(uri);
    console.log(
      `MongoDB connected !! DB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
