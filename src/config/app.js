import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  OWNER_USERNAME: process.env.OWNER_USERNAME,
  OWNER_PASSWORD: process.env.OWNER_PASSWORD,
  TOKEN_REFRESH_KEY: process.env.TOKEN_REFRESH_KEY,
  TOKEN_REFRESH_TIME: process.env.TOKEN_REFRESH_TIME,
  TOKEN_ACCES_KEY: process.env.TOKEN_ACCES_KEY,
  TOKEN_ACCES_TIME: process.env.TOKEN_ACCES_TIME,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASWORD: process.env.MAIL_PASWORD,
};
