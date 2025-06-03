import mongoose from "mongoose";
const { Schema } = mongoose;

const explicitAttributesSchema = new Schema({
  name: String,
});
const implicitAttributesSchema = new Schema({
  name: String,
});
const ticketMetadataSchema = new Schema({
  taskType: String,
  ticketType: String,
  ticketTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TicketType", // <-- This is your foreign key
    required: true,
  },
  explicitAttributes: [explicitAttributesSchema],
  implicitAttributes: [implicitAttributesSchema],
});

ticketMetadataSchema.index({ taskType: 1, ticketType: 1 }, { unique: true });

const TicketMetadataSchema = mongoose.model(
  "TicketMetadata",
  ticketMetadataSchema
);

export { TicketMetadataSchema };
