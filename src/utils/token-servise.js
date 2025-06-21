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
      expiresIn: config.TOKEN_REFRESH_TIME,
    });
  }

  async verifyToken(token, secretKey) {
    return jwt.verify(token, secretKey);
  }
}
