import mongoose from "mongoose";
const { Schema } = mongoose;

const explicitAttributesSchema = new Schema({
  name: String,
});
const implicitAttributesSchema = new Schema({
  name: String,
});
const ticketMetadataSchema = new Schema({
  ticketType: String,
  explicitAttributes: [explicitAttributesSchema],
  implicitAttributes: [implicitAttributesSchema],
});

const TicketMetadataSchema = mongoose.model(
  "TicketMetadata",
  ticketMetadataSchema
);

export { TicketMetadataSchema };
