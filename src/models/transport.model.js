import { Schema, model } from "mongoose";

const transportSchema = new Schema(
  {
    transportType: {
      type: String,
      required: true,
      enum: ["electronical", "mechanical"],
      default: "electronical",
    },
    transportNumber: { type: String, required: true },
    class: {
      type: String,
      enum: ["car", "bus", "truck", "bicycle", "motorcycle", "train", "plane"],
      default: "bus",
      required: true,
    },
    seat: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
transportSchema.virtual("tickets", {
  ref: "Ticket",
  localField: "_id",
  foreignField: "transportId",
});

const Transport = model("Transport", transportSchema);
export default Transport;
