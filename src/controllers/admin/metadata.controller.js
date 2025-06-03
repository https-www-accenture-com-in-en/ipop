import { TicketMetadataSchema } from "../../models/metadata.model.js";
import { TicketType } from "../../models/ticket-types.model.js";
import mongoose from "mongoose";

const httpBulkTicketMetadata = async (req, res) => {
  const { create = [], update = [], delete: deleteOps = [] } = req.body;
  const session = await mongoose.startSession();
  const results = {
    created: [],
    updated: [],
    deleted: [],
    errors: [],
  };

  try {
    await session.withTransaction(async () => {
      // --- DELETIONS ---
      if (deleteOps.length) {
        const idsToDelete = deleteOps
          .map((op) => op.id)
          .filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (idsToDelete.length) {
          await TicketMetadataSchema.deleteMany(
            { _id: { $in: idsToDelete } },
            { session }
          );
          results.deleted.push(...idsToDelete);
        }
      }

      // --- CREATIONS ---
      for (const item of create) {
        try {
          // Find TicketType to set ticketTypeId
          const categoryDoc = await mongoose
            .model("DeliveryWorkTypeCategory")
            .findOne({
              taskType: item.taskType,
            });
          if (!categoryDoc) {
            throw new Error(
              "DeliveryWorkTypeCategory not found for taskType: " +
                item.taskType
            );
          }
          const ticketTypeDoc = await TicketType.findOne({
            ticketType: item.ticketType,
            deliveryWorkTypeCategoryId: categoryDoc._id,
          });
          if (!ticketTypeDoc) {
            throw new Error("TicketType not found for metadata creation");
          }
          item.ticketTypeId = ticketTypeDoc._id;
          const doc = new TicketMetadataSchema(item);
          await doc.save({ session });
          results.created.push(doc.toObject());
        } catch (err) {
          console.error("Error creating ticket metadata:", err);
          results.errors.push({
            type: "CREATE_ERROR",
            item,
            message: err.message,
          });
        }
      }

      // --- UPDATES ---
      for (const op of update) {
        try {
          const { id, data } = op;
          if (!mongoose.Types.ObjectId.isValid(id)) {
            results.errors.push({
              type: "UPDATE_ERROR",
              id,
              message: "Invalid ID",
            });
            continue;
          }
          // Find TicketType to set ticketTypeId if ticketType/taskType changed
          let ticketTypeId = data.ticketTypeId;
          if (data.ticketType && data.taskType) {
            const ticketTypeDoc = await TicketType.findOne({
              ticketType: data.ticketType,
              taskType: data.taskType,
            });
            if (ticketTypeDoc) {
              ticketTypeId = ticketTypeDoc._id;
            }
          }
          const updatedDoc = await TicketMetadataSchema.findByIdAndUpdate(
            id,
            { $set: { ...data, ...(ticketTypeId && { ticketTypeId }) } },
            { new: true, session, runValidators: true }
          );
          if (updatedDoc) {
            results.updated.push(updatedDoc.toObject());
          } else {
            results.errors.push({
              type: "UPDATE_ERROR",
              id,
              message: "Not found",
            });
          }
        } catch (err) {
          results.errors.push({
            type: "UPDATE_ERROR",
            id: op.id,
            message: err.message,
          });
        }
      }

      if (results.errors.length) {
        throw new Error("Bulk operation failed, rolling back.");
      }
    });

    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    session.endSession();
    res.status(500).json({
      error: "Bulk operation failed. Changes likely rolled back.",
      details: results.errors.length
        ? results.errors
        : [{ message: err.message }],
    });
  } finally {
    session.endSession();
  }
};

const httpAddMetadata = async (req, res) => {
  let { taskType, ticketType, explicitAttributes, implicitAttributes } =
    req.body;

  if (!taskType || !ticketType) {
    return res
      .status(400)
      .json({ error: "taskType and ticketType are required" });
  }

  if (
    Array.isArray(explicitAttributes) &&
    typeof explicitAttributes[0] === "string"
  ) {
    explicitAttributes = explicitAttributes.map((name) => ({ name }));
  }
  if (
    Array.isArray(implicitAttributes) &&
    typeof implicitAttributes[0] === "string"
  ) {
    implicitAttributes = implicitAttributes.map((name) => ({ name }));
  }

  try {
    // Find TicketType to set ticketTypeId
    const ticketTypeDoc = await TicketType.findOne({
      ticketType,
      taskType,
    });
    if (!ticketTypeDoc) {
      return res
        .status(400)
        .json({ error: "TicketType not found for metadata" });
    }

    const updatedDoc = await TicketMetadataSchema.findOneAndUpdate(
      { taskType, ticketType },
      {
        $set: {
          explicitAttributes,
          implicitAttributes,
          ticketTypeId: ticketTypeDoc._id,
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Ticket metadata upserted successfully",
      data: updatedDoc,
    });
  } catch (err) {
    console.log("Error upserting ticket metadata:", err);
    console.error("Upsert error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpGetMetadata = async (req, res) => {
  try {
    const allMetadata = await TicketMetadataSchema.find({});
    return res.status(200).json(allMetadata);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { httpAddMetadata, httpGetMetadata, httpBulkTicketMetadata };
