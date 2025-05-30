import { TicketMetadataSchema } from "../../models/metadata.model.js";

const httpBulkUpsertMetadata = async (req, res) => {
  const payload = req.body;
  if (!Array.isArray(payload)) {
    return res.status(400).json({ error: "Payload must be an array" });
  }

  const bulkOps = payload
    .map((item) => {
      let { taskType, ticketType, explicitAttributes, implicitAttributes } =
        item;
      if (!taskType || !ticketType) return null;

      // Ensure attributes are in correct format
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

      return {
        updateOne: {
          filter: { taskType, ticketType },
          update: {
            $set: { explicitAttributes, implicitAttributes },
          },
          upsert: true,
        },
      };
    })
    .filter(Boolean);

  try {
    if (bulkOps.length === 0) {
      return res.status(400).json({ error: "No valid items to upsert" });
    }
    await TicketMetadataSchema.bulkWrite(bulkOps);
    return res.status(200).json({ message: "Bulk upsert successful" });
  } catch (err) {
    console.error("Bulk upsert error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
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
    const updatedDoc = await TicketMetadataSchema.findOneAndUpdate(
      { taskType, ticketType },
      {
        $set: {
          explicitAttributes,
          implicitAttributes,
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Ticket metadata upserted successfully",
      data: updatedDoc,
    });
  } catch (err) {
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

export { httpAddMetadata, httpGetMetadata, httpBulkUpsertMetadata };
