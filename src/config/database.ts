import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.log("No URI found in .env file");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Connected to database");
  } catch (error) {
    throw new Error("Error connecting to database: " + error);
  }
};

export default connectDB;
