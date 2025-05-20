import { MasterWorkType, DeliveryWorkType } from "../../models/master.model.js";

const httpMasterDeliveryWT = async (req, res) => {
  try {
    const master = await MasterDeliveryWT.find({});
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpCreateMasterDeliveryWT = async (req, res) => {
  try {
    const payload = req.body;
    const result = [];

    for (const entry of payload) {
      const { masterWorkTypes, gui_type, sequence, deliveryWorkTypes } = entry;
      console.log(entry);
      const masterWorkType = await MasterWorkType.create({
        masterWorkTypes,
        gui_type,
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

export { httpMasterDeliveryWT, httpCreateMasterDeliveryWT };
