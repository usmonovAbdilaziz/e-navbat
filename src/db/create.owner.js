import Admin from "../models/admin.model.js";

import { Crypto } from "../utils/hashed.js";
import config from "../config/app.js";
import { Token } from "../utils/token-servise.js";

const crypto = new Crypto();
const token = new Token();

export const createSuperAdmin = async (req, res) => {
  try {
    const existsSuperAdmin = await Admin.findOne({ role: "superadmin" });
    if (!existsSuperAdmin) {
      const hashedPassword = await crypto.encrypt(config.OWNER_PASSWORD);
      const newAdmin = await Admin.create({
        username: config.OWNER_USERNAME,
        password: hashedPassword,
        role: "superadmin",
      });
      // const admin = await Admin.findOne({ role: "superadmin" });
      // const payload = { id: admin._id, role: admin.role };
      // const refreshToken = await token.generateAccesToken(payload);
      // const accessToken = await token.generateRefreshToken(payload);
      // newAdmin.token = accessToken;
      // res.cookie("refreshTokenAdmin", refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      //   secure: true,
      // });

      // return successMessage(res, newAdmin, 201);
      console.log("Owner Created");
    }
  } catch (error) {
    console.log(`Error on creating superadmin: ${error}`);
  }
};
