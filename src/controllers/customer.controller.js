import Customer from "../models/customer.model.js";
import {
  confirmSignInCustomerValidator,
  signInCustomerValidator,
  signUpCustomerValidator,
} from "../validation/customer-validator.js";
import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import { Token } from "../utils/token-servise.js";
import { generetOTP } from "../helpers/genereate-otp.js";
import NodeCache from "node-cache";
import config from "../config/app.js";
import { transporter } from "../helpers/send-mail.js";

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
      if (error) {
        return handleError(res, error, 422);
      }

      const email = value.email;
      const existsEmail = await Customer.findOne({ email });
      if (!existsEmail) {
        return handleError(res, "Customer not found", 404);
      }

      const otp = generetOTP();
      const mailOptions = {
        from: config.MAIL_USER,
        to: email,
        subject: "e-navbat",
        text: otp,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email yuborishda xatolik:", error);
          return handleError(res, "Error sending email", 400);
        }

        console.log("Email yuborildi:", info.response);
        cache.set(email, otp, 120);
        return successMessage(res, `Email sent successfully. OTP: ${otp}`);
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
  async confirmSignin(req, res) {
    try {
      const { value, error } = confirmSignInCustomerValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const cacheOTP = cache.get(value.email);
      if (!cacheOTP || cacheOTP != value.otp) {
        return handleError(res, "OTP expired", 400);
      }
      const email = value.email;
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
        return handleError(res, "Customer not found", 400);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.TOKEN_REFRESH_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Token not found", 401);
      }
      const customer = Customer.findById(decodedToken.id);
      if (!customer) {
        return handleError(res, "Customer not found", 404);
      }
      const payload = { id: customer._id };
      const accesToken = generateAccesToken(payload);
      return successMessage(res, { token: accesToken });
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default new CustomerController();
