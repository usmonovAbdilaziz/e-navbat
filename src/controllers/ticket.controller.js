import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import {
  confirmSignInTicketValidator,
  createTicketValidator,
  signInTicketValidator,
  updateTicketValidator,
} from "../validation/ticket.validator.js";
import Transport from "../models/transport.model.js";
import Ticket from "../models/ticket.model.js";
import { isValidObjectId } from "mongoose";
import { generetOTP } from "../helpers/genereate-otp.js";
import NodeCache from "node-cache";
import { send_sms } from "../helpers/send-sms.js";
import { Token } from "../utils/token-servise.js";

const cache = new NodeCache();
const token = new Token();

class TicketController {
  async createTicket(req, res) {
    try {
      const ticketCount = await Ticket.countDocuments({
        transportId: req.body.transportId,
      });
      const transport = await Transport.findById(req.body.transportId);
      if (!transport) {
        return handleError(res, "Transport topilmadi", 404);
      }
      if (transport.seat <= ticketCount) {
        return handleError(res, "Transportda joylar to‘lib bo‘lgan", 400);
      }
      const { value, error } = createTicketValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      if (!isValidObjectId(value.transportId)) {
        return handleError(res, "Invalid Id", 400);
      }
      const exstsTransport = await Transport.findById(value.transportId);
      if (!exstsTransport) {
        return handleError(res, "Transport not found", 400);
      }
      const newTicket = await Ticket.create(value);
      return successMessage(res, newTicket, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async signinTicket(req, res) {
    try {
      const { value, error } = signInTicketValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const { phoneNumber } = value;
      const ticket = Ticket.findOne({ phoneNumber });
      if (!ticket) {
        return handleError(res, "Ticket not found", 404);
      }
      const otp = generetOTP(6);
      cache.set(phoneNumber, otp, 120);
      await send_sms(phoneNumber.split("+")[1], otp);
      return successMessage(res, "Sended message");
    } catch (error) {
      return handleError(res, error);
    }
  }
  async confirmSigninTicket(req, res) {
    try {
      const { value, error } = confirmSignInTicketValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const cacheOTP = cache.get(value.phoneNumber);
      if (!cacheOTP || cacheOTP != value.otp) {
        return handleError(res, "OTP expired", 400);
      }
      const phoneNumber = value.phoneNumber;
      const ticket = await Customer.findOne({ phoneNumber });
      if (!ticket) {
        return handleError(res, "Costumer not found");
      }
      cache.del(phoneNumber);
      const payload = { id: ticket._id };
      const accesToken = await token.generateAccesToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenTicket", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return successMessage(
        res,
        {
          data: ticket,
          token: accesToken,
        },
        200
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllTicket(_, res) {
    try {
      const allTickets = await Ticket.find()
        .populate("customerId")
        .populate("transportId");
      return successMessage(res, allTickets);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getTicketById(req, res) {
    try {
      const ticket = await TicketController.findTicketById(res, req.params.id);
      return successMessage(res, ticket);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateTicket(req, res) {
    try {
      const id = req.params.id;
      const ticket = await TicketController.findTicketById(res, id);
      const ticketCount = await Ticket.countDocuments({
        transportId: ticket.transportId,
      });
      const transport = await Transport.findById(ticket.transportId);
      if (transport.seat <= ticketCount - 1) {
        return handleError(res, "Transportda joylar tulgan", 400);
      }
      const { value, error } = updateTicketValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }

      const newTicket = await Ticket.findByIdAndUpdate(id, value, {
        new: true,
      });
      return successMessage(res, newTicket);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteTicket(req, res) {
    try {
      const id = req.params.id;
      await TicketController.findTicketById(res, id);
      await Ticket.findByIdAndDelete(id);
      return successMessage(res, "Ticket deleted");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findTicketById(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Id", 400);
      }
      const ticket = await Ticket.findById(id)
        .populate("transportId")
        .populate("customerId");
      if (!ticket) {
        return handleError(res, "Ticket not found", 404);
      }
      return ticket;
    } catch (error) {
      return handleError(res, error);
    }
  }
}
export default new TicketController();
