import { Schema, Types, model } from "mongoose";

const ticketSchema = new Schema(
  {
    phoneNumber: { type: String, required: true },
    transportId: { type: Types.ObjectId, ref: "Transport", required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    price: { type: String, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    customerId: { type: String, required: true },
  },
  { timestamps: true }
);

const Ticket = model("Ticket", ticketSchema);
export default Ticket;
