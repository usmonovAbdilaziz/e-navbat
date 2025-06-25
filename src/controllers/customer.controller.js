import Customer from "../models/customer.model.js";
import {
  createCustomerValidator,
  confirmSignInCustomerValidator,
  signInCustomerValidator,
  signUpCustomerValidator,
  updateCustomerValidator,
} from "../validation/customer-validator.js";
import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import { Token } from "../utils/token-servise.js";
import { generetOTP } from "../helpers/genereate-otp.js";
import NodeCache from "node-cache";
import config from "../config/app.js";
import { sendMailPromise } from "../helpers/send-mail.js";
import { isValidObjectId } from "mongoose";

const token = new Token();
const cache = new NodeCache();
class CustomerController {
  async signUp(req, res) {
    try {
      const { value, error } = signUpCustomerValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const existsEmail = await Customer.findOne({ email: value.email });
      if (existsEmail) {
        return handleError(res, "Eamil already exsist", 409);
      }
      const newCustomer = await Customer.create(value);
      const payload = { id: newCustomer._id };
      const accesToken = await token.generateAccesToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenCustomer", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return successMessage(
        res,
        {
          data: newCustomer,
          token: accesToken,
        },
        201
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
  async signIn(req, res) {
    try {
      const { value, error } = signInCustomerValidator(req.body);
      if (error) return handleError(res, error, 422);
      const email = value.email;
      const existsEmail = await Customer.findOne({ email });
      if (!existsEmail) return handleError(res, "Customer not found", 404);
      const otp = generetOTP();
      const mailOptions = {
        from: config.MAIL_USER,
        to: email,
        subject: "e-navbat",
        text: otp,
      };
      await sendMailPromise(mailOptions);
      cache.set(email, otp, 120);
      return successMessage(res, `Email sent successfully. OTP: ${otp}`);
    } catch (error) {
      console.error("Email yuborishda xatolik:", error);
      return handleError(res, "Error sended on email", 400);
    }
  }
  async confirmSignin(req, res) {
    try {
      const { value, error } = confirmSignInCustomerValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const email = value.email;
      const cacheOTP = cache.get(email);
      if (!cacheOTP || cacheOTP != value.otp) {
        return handleError(res, "OTP expired", 400);
      }
      const newCustomer = await Customer.findOne({ email });
      if (!newCustomer) {
        return handleError(res, "Costumer not found");
      }
      const payload = { id: newCustomer._id };
      const accesToken = await token.generateAccesToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenCustomer", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return successMessage(
        res,
        {
          data: newCustomer,
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
      const refreshToken = req.cookies?.refreshTokenCustomer;
      if (!refreshToken) {
        return handleError(res, "Refresh token expired", 400);
      }

      console.log("dsq4587382034-30w3rt3w");
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.TOKEN_REFRESH_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 400);
      }
      const customer = await Customer.findById(decodedToken.id);
      if (!customer) {
        return handleError(res, "Customer topilmadi", 404);
      }
      const payload = { id: customer._id };
      const accessToken = await token.generateAccesToken(payload);
      console.log(accessToken);

      return successMessage(res, { token: accessToken });
    } catch (error) {
      return handleError(res, error);
    }
  }
  async logOut(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenCustomer;
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
      const customer = await Customer.findById(decodedToken.id);
      if (!customer) {
        return handleError(res, "Customer not found", 404);
      }
      res.clearCookie("refreshTokenCustomer");
      return successMessage(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }
  async createCustomer(req, res) {
    try {
      const { value, error } = createCustomerValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const email = value.email;
      const existsEmail = await Customer.findOne({ email });
      if (existsEmail) {
        handleError(res, "Customer already exists", 409);
      }
      const newCustomer = await Customer.create(value);
      return successMessage(res, newCustomer, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllCustomer(_, res) {
    try {
      const allCustomer = await Customer.find()
        .populate("pasports")
        .populate({
          path: "tickets",
          populate: { path: "transportId" }, // ticket ichidagi transportni ham olib kelish
        });
      return successMessage(res, allCustomer);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getCustomerById(req, res) {
    try {
      const customer = await CustomerController.findCustomerById(
        res,
        req.params.id
      );
      return successMessage(res, customer);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateCustomer(req, res) {
    try {
      const id = req.params.id;
      await CustomerController.findCustomerById(res, id);
      const { value, error } = updateCustomerValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const newCustomer = await Customer.findByIdAndUpdate(id, value, {
        new: true,
      });
      return successMessage(res, newCustomer);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteCustomer(req, res) {
    try {
      const id = req.params.id;
      await CustomerController.findCustomerById(res, id);
      await Customer.findByIdAndDelete(id);
      return successMessage(res, "Deleted Customer");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findCustomerById(res, id) {
    if (!isValidObjectId(id)) {
      return handleError(res, "Invalid ID format", 400);
    }
    const customer = await Customer.findById(id)
      .populate("pasports")
      .populate({
        path: "tickets",
        populate: { path: "transportId" }, // ticket ichidagi transportni ham olib kelish
      });
    if (!customer) {
      return handleError(res, "Customer not found", 404);
    }
    return customer;
  }
}

export default new CustomerController();
