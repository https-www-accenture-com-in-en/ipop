import { TicketMetadataSchema } from "../../models/metadata.model.js";

const httpMetadata = async (req, res) => {
    const { ticketType, explicitAttributes, implicitAttributes } = req.body;

  if (!ticketType) {
    return res.status(400).json({ error: "ticketType is required" });
  }

  try {
    const updatedDoc = await TicketMetadataSchema.findOneAndUpdate(
      { ticketType },
      {
        $set: {
          explicitAttributes,
          implicitAttributes
        }
      },
      { new: true, upsert: true } // upsert = create if not exist
    );

    return res.status(200).json({
      message: "Ticket metadata upserted successfully",
      data: updatedDoc
    });
  } catch (err) {
    console.error("Upsert error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export{
    httpMetadata
}