import Admin from "../models/admin.model.js";
import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import { Crypto } from "../utils/hashed.js";
import {
  createValidator,
  updateValidator,
} from "../validation/admin.validation.js";
import { isValidObjectId } from "mongoose";

const crypto = new Crypto();

class AdminController {
  async createAdmin(req, res) {
    try {
      const { value, error } = createValidator(req.body); //Admin malumotlarini validat qilmoqda
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
      const { value, error } = updateValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      let hashedPassword = admin.password;
      if (value.password) {
        hashedPassword = await crypto.encrypt(value.password);
      }
      console.log("01703489704279109");
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
