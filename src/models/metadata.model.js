import mongoose from "mongoose";
const { Schema } = mongoose;

const ticketMetadataSchema = new Schema({
  ticketType: String,
  explicitAttributes: [String],
  implicitAttributes: [String],
});

const TicketMetadataSchema = mongoose.model('TicketMetadata',ticketMetadataSchema)

export {TicketMetadataSchema}