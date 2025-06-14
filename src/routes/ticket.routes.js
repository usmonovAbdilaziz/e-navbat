import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";

const controller = TicketController;

const router = Router();

router
  .post("/", controller.createTicket)
  .get("/", controller.getAllTicket)
  .get("/:id", controller.getTicketById)
  .patch("/:id", controller.updateTicket)
  .delete("/:id", controller.deleteTicket);
export default router;
