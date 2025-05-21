import { MasterWorkType, DeliveryWorkType } from "../../models/master.model.js";

const httpGetDeliveryWT = async (req, res) => {
  try {
    // Fetch all master work types and populate their delivery work types
    const data = await DeliveryWorkType.find();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching master/delivery work types:", error);
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

export { httpGetDeliveryWT, httpCreateMasterDeliveryWT };
