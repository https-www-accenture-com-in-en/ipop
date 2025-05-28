import mongoose from "mongoose";
import { Schema } from "mongoose";

const ticketTypeSchema = Schema(
  {
    ticketType: {
      type: String,
      required: true,
      trim: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    deliveryWorkTypeCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryWorkTypeCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TicketType = mongoose.model("TicketType", ticketTypeSchema);

export { TicketType };
