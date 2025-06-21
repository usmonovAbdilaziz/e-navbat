import config from "../config/app.js";
import jwt from "jsonwebtoken";
export class Token {
  async generateAccesToken(payload) {
    return jwt.sign(payload, config.TOKEN_ACCES_KEY, {
      expiresIn: config.TOKEN_ACCES_TIME,
    });
  }
  async generateRefreshToken(payload) {
    return jwt.sign(payload, config.TOKEN_REFRESH_KEY, {
      expiresIn: config.TOKEN_REFRESH_KEY,
    });
  }

  async verifyToken(token, secretKey) {
    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      console.error("Token not valid:", err.message);
      return null;
    }
  }
}
