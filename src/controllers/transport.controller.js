import Transport from "../models/transport.model.js";
import {
  createTransportValidator,
  updateTransportValidator,
} from "../validation/transport-validator.js";
import { handleError } from "../helpers/error.js";
import { successMessage } from "../helpers/succes.js";
import { isValidObjectId } from "mongoose";
import Ticket from "../models/ticket.model.js";

class TransportController {
  async createTransport(req, res) {
    try {
      const { value, error } = createTransportValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const exists = await Transport.findOne({
        transportNumber: value.transportNumber,
      });
      if (exists) {
        return handleError(res, "Transport already exists", 409);
      }
      const newTransport = await Transport.create(value);
      return successMessage(res, newTransport, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllTransports(_, res) {
    try {
      const allTransport = await Transport.find().populate("tickets");
      return successMessage(res, allTransport);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getTransportById(req, res) {
    try {
      const id = req.params.id;
      const transport = await TransportController.findByIdTransport(res, id);
      return successMessage(res, transport);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateTransport(req, res) {
    try {
      const id = req.params.id;
      await TransportController.findByIdTransport(res, id);
      const { value, error } = updateTransportValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const newTransport = await Transport.findByIdAndUpdate(id, value, {
        new: true,
      });
      return successMessage(res, newTransport);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteTransport(req, res) {
    try {
      const id = req.params.id;
      await TransportController.findByIdTransport(res, id);
      await Transport.findByIdAndDelete(id);
      await Ticket.deleteMany({ transportId: id });
      return successMessage(res, "Deleted Transport");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findByIdTransport(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid ID format", 400);
      }
      const transport = await Transport.findById(id).populate("tickets");
      if (!transport) {
        return handleError(res, "Transport not found", 404);
      }
      return transport;
    } catch (error) {
      return handleError(res, error);
    }
  }
}
export default new TransportController();
