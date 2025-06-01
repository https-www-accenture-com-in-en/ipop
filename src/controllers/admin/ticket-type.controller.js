import { TicketType } from "../../models/ticket-types.model.js";
import { DeliveryWorkTypeCategory } from "../../models/delivery-worktype-category.model.js";
import mongoose from "mongoose";

// Bulk upsert controller for ticket types per task type
export const httpCreateTicketType = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const requestData = req.body;
    if (!Array.isArray(requestData) || requestData.length === 0) {
      return res
        .status(400)
        .json({ message: "Request body must be a non-empty array." });
    }

    await session.withTransaction(async () => {
      for (const group of requestData) {
        const { taskType, ticketTypes } = group;

        if (
          !taskType ||
          !Array.isArray(ticketTypes) ||
          ticketTypes.length === 0
        ) {
          throw new Error(
            "Each taskType must have a non-empty ticketTypes array."
          );
        }

        // Find the DeliveryWorkTypeCategory for this taskType
        const categoryDoc = await DeliveryWorkTypeCategory.findOne({
          taskType,
        });
        if (!categoryDoc) {
          throw new Error(
            `DeliveryWorkTypeCategory not found for taskType: ${taskType}`
          );
        }
        const deliveryWorkTypeCategoryId = categoryDoc._id;

        // Get all existing ticket types for this category
        const existingTickets = await TicketType.find({
          deliveryWorkTypeCategoryId,
        });
        const existingMap = {};
        existingTickets.forEach((t) => {
          existingMap[t.ticketType] = t;
        });

        // Upsert incoming ticket types
        const incomingNames = ticketTypes.map((t) => t.ticketType);
        for (const ticket of ticketTypes) {
          if (!ticket.ticketType || typeof ticket.sequence !== "number") {
            throw new Error(
              `Invalid ticketType object under taskType: ${taskType}`
            );
          }
          if (existingMap[ticket.ticketType]) {
            // Update sequence if changed
            await TicketType.updateOne(
              { _id: existingMap[ticket.ticketType]._id },
              { $set: { sequence: ticket.sequence } }
            );
          } else {
            // Insert new
            await TicketType.create({
              ticketType: ticket.ticketType,
              sequence: ticket.sequence,
              deliveryWorkTypeCategoryId,
            });
          }
        }

        // Delete ticket types not in the new list
        const toDelete = existingTickets.filter(
          (t) => !incomingNames.includes(t.ticketType)
        );
        if (toDelete.length) {
          await TicketType.deleteMany({
            _id: { $in: toDelete.map((t) => t._id) },
          });
        }
      }
    });

    return res.status(200).json({
      message: "Ticket types upserted successfully.",
    });
  } catch (error) {
    console.error("Error upserting ticket types:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const httpGetTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find().sort({ sequence: 1 }).populate({
      path: "deliveryWorkTypeCategoryId",
      select: "taskType", // only get taskType from the referenced document
    });

    const response = ticketTypes.map((ticket) => ({
      id: ticket._id,
      ticketType: ticket.ticketType,
      sequence: ticket.sequence,
      taskType: ticket.deliveryWorkTypeCategoryId?.taskType || null,
    }));

    res.status(200).json({
      message: "Ticket types with taskType fetched successfully.",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching ticket types:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
