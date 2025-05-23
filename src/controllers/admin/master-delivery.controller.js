import { MasterWorkType, DeliveryWorkType } from "../../models/master.model.js";

// @desc    Get all delivery work types
// @route   GET /api/v1/admin/delivery-work-types
export const httpGetDeliveryWT = async (req, res) => {
  try {
    const data = await DeliveryWorkType.find({}, { deliveryWorkTypes: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching delivery work types:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all master work types
// @route   GET /api/v1/admin/master-work-types
export const httpGetMasterWT = async (req, res) => {
  try {
    const data = await MasterWorkType.find({}, { masterWorkTypes: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching master work types:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get Master along with delivery work types
// @route   GET /api/v1/admin/master-work-types-with-delivery
export const httpGetMasterWithDeliveryWorkTypes = async (req, res) => {
  try {
    const result = await MasterWorkType.aggregate([
      {
        $lookup: {
          from: "deliveryworktypes", // collection name (lowercase plural)
          localField: "_id",
          foreignField: "MasterWorkTypeId",
          as: "deliveryWorkTypes",
        },
      },
      {
        $project: {
          id: "$_id",
          _id: 0,
          masterWorkTypes: 1,
          uiType: 1,
          deliveryWorkTypes: {
            $map: {
              input: "$deliveryWorkTypes",
              as: "dw",
              in: {
                id: "$$dw._id",
                deliveryWorkType: "$$dw.deliveryWorkTypes",
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Create master and delivery work types
// @route   POST /api/v1/admin/master-and-delivery-work-types
export const httpCreateMasterDeliveryWT = async (req, res) => {
  try {
    const payload = req.body;
    const result = [];

    for (const entry of payload) {
      const { masterWorkTypes, uiType, sequence, deliveryWorkTypes } = entry;
      const masterWorkType = await MasterWorkType.create({
        masterWorkTypes,
        uiType,
        sequence,
      });

      const deliveryWorkType = await DeliveryWorkType.insertMany(
        deliveryWorkTypes.map((dw) => ({
          deliveryWorkTypes: dw,
          sequence,
          MasterWorkTypeId: masterWorkType._id,
        }))
      );

      result.push({ masterWorkType, deliveryWorkType });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error posting:", error);
    res.status(500).json({ error: error.message });
  }
};

export const editWorkTypes = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res
        .status(400)
        .json({ error: "Request body should be an array of updates" });
    }

    const updateOperations = updates.map(async (item) => {
      const { id } = item;
      if (!id) return;

      // Build dynamic payloads
      const masterPayload = {};
      const deliveryPayload = {};

      if (item.masterWorkTypes)
        masterPayload.masterWorkTypes = item.masterWorkTypes;
      if (item.uiType) masterPayload.uiType = item.uiType;
      if (item.sequence !== undefined) {
        masterPayload.sequence = item.sequence;
        deliveryPayload.sequence = item.sequence;
      }
      if (item.deliveryWorkTypes)
        deliveryPayload.deliveryWorkTypes = item.deliveryWorkTypes;

      // Determine which collection the ID belongs to
      const isMaster = await MasterWorkType.exists({ _id: id });

      if (isMaster) {
        return MasterWorkType.findByIdAndUpdate(id, masterPayload);
      } else {
        return DeliveryWorkType.findByIdAndUpdate(id, deliveryPayload);
      }
    });

    await Promise.all(updateOperations);

    res.status(200).json({ message: "All updates applied successfully" });
  } catch (error) {
    console.error("Error processing updates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
