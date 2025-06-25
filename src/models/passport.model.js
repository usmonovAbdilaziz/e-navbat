import { Schema, Types, model } from "mongoose";

const pasportSchema = new Schema(
  {
    jshshr: { type: String, required: true, unique: true },
    serial_number: { type: String, required: true, unique: true },
    customerId: {
      type: Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    },
    full_name: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
pasportSchema.virtual("pasports", {
  ref: "Customer",
  localField: "_id",
  foreignField: "customerId",
});
const Passport = model("Passport", pasportSchema);
export default Passport;
