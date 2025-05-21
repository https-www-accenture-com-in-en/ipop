import { MasterWorkType, DeliveryWorkType } from "../../models/master.model.js";

const httpGetDeliveryWT = async (req, res) => {
  try {
    // Fetch all master work types and populate their delivery work types
    const data = await DeliveryWorkType.find({}, { deliveryWorkTypes: 1 });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching delivery work types:", error);
    res.status(500).json({ error: error.message });
  }
};

const httpGetMasterWT = async (req, res) => {
  try {
    // Fetch all master work types and populate their delivery work types
    const data = await MasterWorkType.find({}, { masterWorkTypes: 1 });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching master work types:", error);
    res.status(500).json({ error: error.message });
  }
};

const httpCreateMasterDeliveryWT = async (req, res) => {
  try {
    const payload = req.body;
    const result = [];

    for (const entry of payload) {
      const { masterWorkTypes, uiType, sequence, deliveryWorkTypes } = entry;
      console.log(entry);
      const masterWorkType = await MasterWorkType.create({
        masterWorkTypes,
        uiType,
        sequence,
      });

      console.log(deliveryWorkTypes);
      const deliveryWorkType = await DeliveryWorkType.insertMany(
        deliveryWorkTypes.map((dw) => ({
          masterWorkTypes,
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

export { httpGetDeliveryWT, httpGetMasterWT, httpCreateMasterDeliveryWT };
