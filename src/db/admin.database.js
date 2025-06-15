import { connect } from "mongoose";
import { config } from "dotenv";
config();
const MONGODB_URI = process.env.MONGO_URL;
export const connectDB = async () => {
  try {
    await connect(MONGODB_URI).then(() => []);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
