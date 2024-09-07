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
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connectDB;
