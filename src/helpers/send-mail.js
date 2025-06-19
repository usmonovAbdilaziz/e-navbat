import { createTransport } from "nodemailer";
import config from "../config/app.js";

export const transporter = createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT,
  secure: true,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASWORD,
  },
});
