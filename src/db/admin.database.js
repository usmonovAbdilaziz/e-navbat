import { connect } from "mongoose";

import config from "../config/app.js";

const MONGODB_URI = config.MONGO_URI;
export const connectDB = async () => {
  try {
    await connect(MONGODB_URI).then(() => []);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
