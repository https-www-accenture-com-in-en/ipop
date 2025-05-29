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

ticketTypeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const TicketType = mongoose.model("TicketType", ticketTypeSchema);

export { TicketType };
