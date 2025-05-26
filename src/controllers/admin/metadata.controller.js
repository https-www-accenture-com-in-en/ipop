import { TicketMetadataSchema } from "../../models/metadata.model.js";

const httpAddMetadata = async (req, res) => {
  const { ticketType, explicitAttributes, implicitAttributes } = req.body;

  if (!ticketType) {
    return res.status(400).json({ error: "ticketType is required" });
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
      { ticketType },
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

export { httpAddMetadata, httpGetMetadata };
