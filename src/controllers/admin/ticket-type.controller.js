import { TicketType } from "../../models/ticket-types.model.js";
import { DeliveryWorkTypeCategory } from "../../models/delivery-worktype-category.model.js";

export const httpCreateTicketType = async (req, res) => {
  try {
    const requestData = req.body;
    console.log(requestData);

    if (!Array.isArray(requestData) || requestData.length === 0) {
      return res
        .status(400)
        .json({ message: "Request body must be a non-empty array." });
    }

    const ticketsToInsert = [];

    for (const group of requestData) {
      const { taskType, ticketTypes } = group;

      if (
        !taskType ||
        !Array.isArray(ticketTypes) ||
        ticketTypes.length === 0
      ) {
        return res.status(400).json({
          message: "Each taskType must have a non-empty ticketTypes array.",
        });
      }

      // Look up the unique taskType in DeliveryWorkTypeCategory
      const categoryDoc = await DeliveryWorkTypeCategory.findOne({ taskType });

      if (!categoryDoc) {
        return res.status(404).json({
          message: `DeliveryWorkTypeCategory not found for taskType: ${taskType}`,
        });
      }

      const deliveryWorkTypeCategoryId = categoryDoc._id;

      for (const ticket of ticketTypes) {
        if (!ticket.ticketType || typeof ticket.sequence !== "number") {
          return res.status(400).json({
            message: `Invalid ticketType object under taskType: ${taskType}`,
          });
        }

        ticketsToInsert.push({
          ticketType: ticket.ticketType,
          sequence: ticket.sequence,
          deliveryWorkTypeCategoryId,
        });
      }
    }

    const inserted = await TicketType.insertMany(ticketsToInsert);

    return res.status(201).json({
      message: "Ticket types inserted successfully.",
      data: inserted,
    });
  } catch (error) {
    console.error("Error inserting ticket types:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
