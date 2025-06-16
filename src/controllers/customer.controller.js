import Customer from "../models/customer.model.js";
import { creatCustomerValidator } from "../validation/customer-validator.js";
import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import jwt from "jsonwebtoken";
import config from "../config/app.js";

class CustomerController {
  async signUp(req, res) {
    try {
      const { value, error } = creatCustomerValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const existsEmail = await Customer.findOne({ email: value.email });
      if (existsEmail) {
        return handleError(res, "Eamil already exsist", 409);
      }
      const exsistPhone = await Customer.findOne({
        phoneNumber: value.phoneNumber,
      });
      if (exsistPhone) {
        return handleError(res, "Phone already exists ", 409);
      }
      const newCustomer = await Customer.create(value);
      const payload = { id: newCustomer._id };
      const token = jwt.sign(payload, config.JWT_TOKEN_REFRESH_KEY, {
        expiresIn: config.JWT_TOKEN_REFRESH_TIME,
      });
      return successMessage(
        res,
        {
          data: newCustomer,
          token,
        },
        201
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default new CustomerController();
