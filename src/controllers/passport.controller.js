import Passport from "../models/passport.model.js";
import {
  createValidatorForPs,
  updateValidatorForPs,
} from "../validation/passport.validator.js";
import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import { isValidObjectId } from "mongoose";
import Customer from "../models/customer.model.js";

class PassportController {
  async createPassport(req, res) {
    try {
      const { value, error } = createValidatorForPs(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const isCustomer = await Customer.findById(value.customerId);
      if (!isCustomer) {
        return handleError(res, "Customer not found", 404);
      }
      const existsJshshr = await Passport.findOne({ jshshr: value.jshshr });
      if (existsJshshr) {
        return handleError(res, "Passport already exsist", 409);
      }
      const exsistSerial = await Passport.findOne({
        serial_number: value.serial_number,
      });
      if (exsistSerial) {
        return handleError(res, "Passport already exists", 409);
      }
      const customerId = value.customer_id;
      if (!isCustomer || isValidObjectId(customerId)) {
        return handleError(res, "Invalid Id", 409);
      }
      const newPassport = await Passport.create(value);
      return successMessage(res, newPassport, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllPassports(_, res) {
    try {
      const passports = await Passport.find().populate("customerId");
      return successMessage(res, passports);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getPassportById(req, res) {
    try {
      const id = req.params.id;
      const passport = await PassportController.findPassportById(res, id);
      return successMessage(res, passport);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updatePassport(req, res) {
    try {
      const id = req.params.id;
      await PassportController.findPassportById(res, id);
      const { value, error } = updateValidatorForPs(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const newPassport = await Passport.findByIdAndUpdate(id, value, {
        new: true,
      });
      return successMessage(res, newPassport);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deletePassport(req, res) {
    try {
      const id = req.params.id;
      await PassportController.findPassportById(res, id);
      await Passport.findByIdAndDelete(id);
      return successMessage(res, "Deleted passport");
    } catch (error) {}
  }

  static async findPassportById(res, id) {
    try {
      const passport = Passport.findById(id).populate("customerId");
      if (!passport) {
        return handleError(res, "Passport not found", 404);
      }
      return passport;
    } catch (error) {
      return handleError(res, error);
    }
  }
}
export default new PassportController();
