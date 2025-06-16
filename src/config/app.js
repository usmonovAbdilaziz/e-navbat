import dotenv from "dotenv";
dotenv.config();
export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  OWNER_USERNAME: process.env.OWNER_USERNAME,
  OWNER_PASSWORD: process.env.OWNER_PASSWORD,
  JWT_TOKEN_REFRESH_KEY: process.env.JWT_TOKEN_REFRESH_KEY,
  JWT_TOKEN_REFRESH_TIME: process.env.JWT_TOKEN_REFRESH_TIME,
  JWT_TOKEN_ACCES_KEY: process.env.JWT_TOKEN_ACCES_KEY,
  JWT_TOKEN_ACCES_TIME: process.env.JWT_TOKEN_ACCES_TIME,
};
