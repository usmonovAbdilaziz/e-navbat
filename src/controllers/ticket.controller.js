import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import {
  createTicketValidator,
  updateTicketValidator,
} from "../validation/ticket.validator.js";
import Transport from "../models/transport.model.js";
import Ticket from "../models/ticket.model.js";
import { isValidObjectId } from "mongoose";

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
  async getAllTicket(_, res) {
    try {
      const allTickets = await Ticket.find().populate("transportId");
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
      const ticket = await Ticket.findById(id).populate("transportId");
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
