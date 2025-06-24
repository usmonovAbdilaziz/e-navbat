import Admin from "../models/admin.model.js";
import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import { Crypto } from "../utils/hashed.js";
import {
  createAdminValidator,
  updateAdminValidator,
} from "../validation/admin.validation.js";
import { Token } from "../utils/token-servise.js";
import { isValidObjectId } from "mongoose";
import config from "../config/app.js";

const crypto = new Crypto();
const token = new Token();

class AdminController {
  async createAdmin(req, res) {
    try {
      const { value, error } = createAdminValidator(req.body); //Admin malumotlarini validat qilmoqda
      if (error) {
        return handleError(res, error, 422);
      }
      const existingAdmin = await Admin.findOne({ username: value.username }); //Admin usernamesini qidirmoqda
      if (existingAdmin) {
        return handleError(res, "Username already exists !!!", 409);
      }
      const hashedPassword = await crypto.encrypt(value.password); // passwordin hash qilmoqda
      const newAdmin = await Admin.create({
        username: value.username,
        password: hashedPassword,
      });
      return successMessage(res, newAdmin, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async adminSignin(req, res) {
    try {
      const { value, error } = createAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const username = value.username;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return handleError(res, "Admin not found");
      }
      const payload = { id: admin._id, role: admin.role };
      const accesToken = await token.generateAccesToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenAdmin", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return successMessage(
        res,
        {
          data: admin,
          token: accesToken,
        },
        200
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
  async newAccesToken(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenAdmin;
      if (!refreshToken) {
        return handleError(res, "Refresh token expired", 400);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.TOKEN_REFRESH_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 400);
      }
      const admin = await Admin.findById(decodedToken.id);
      if (!admin) {
        return handleError(res, "Admin topilmadi", 404);
      }
      const payload = { id: admin._id, role: admin.role };
      const accessToken = await token.generateAccesToken(payload);
      return successMessage(res, { token: accessToken });
    } catch (error) {
      return handleError(res, error);
    }
  }
  async logOut(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenAdmin;
      if (!refreshToken) {
        return handleError(res, "Refresh token epxired", 400);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.TOKEN_REFRESH_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 400);
      }
      const admin = await Admin.findById(decodedToken.id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      res.clearCookie("refreshTokenAdmin");
      return successMessage(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAdmins(_, res) {
    try {
      const admins = await Admin.find();
      return successMessage(res, admins, 200);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAdminById(req, res) {
    try {
      const id = req.params.id;
      const admin = await AdminController.findAdminById(res, id);
      return successMessage(res, admin, 200);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateAdmin(req, res) {
    try {
      const id = req.params.id;
      const admin = await AdminController.findAdminById(res, id);
      const { value, error } = updateAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      let hashedPassword = admin.password;
      if (value.password) {
        hashedPassword = await crypto.encrypt(value.password);
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        { ...value, password: hashedPassword },
        { new: true }
      );
      return successMessage(res, updatedAdmin, 200);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteAdmin(req, res) {
    try {
      await AdminController.findAdminById(res, req.params.id);
      await Admin.findByIdAndDelete(id);
      return successMessage(res, `Deleted admin name`, 200);
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findAdminById(res, id) {
    if (!isValidObjectId(id)) {
      return handleError(res, "Invalid ID format", 400);
    }
    const admin = await Admin.findById(id);
    if (!admin) {
      return handleError(res, "Admin not found", 404);
    }
    return admin;
  }
}

export default new AdminController();
