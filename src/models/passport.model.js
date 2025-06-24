import { Schema, Types, model } from "mongoose";

const pasportSchema = new Schema(
  {
    jshshr: { type: String, required: true, unique: true },
    serial_number: { type: String, required: true, unique: true },
    customer_id: { type: Types.ObjectId, required: true, unique: true },
    full_name: { type: String, required: true },
  },
  { timestamps: true }
);
const Passport = model("Passport", pasportSchema);
export default Passport;
