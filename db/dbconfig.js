import mongoose from "mongoose";
import config from "../src/utils/config.js";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(config.MONGODB_URI);
    if (res) {
      console.log("MongoDB connected successfully");
    } else {
      console.log("MongoDB connection failed");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
