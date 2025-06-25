import { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true, toJSON: true, toObject: true }
);
// Passport bilan bog‘lash
customerSchema.virtual("pasports", {
  ref: "Passport",
  localField: "_id",
  foreignField: "customerId",
});

// Ticket bilan bog‘lash
customerSchema.virtual("tickets", {
  ref: "Ticket",
  localField: "_id",
  foreignField: "customerId",
});

const Customer = model("Customer", customerSchema);
export default Customer;
