import { DeliveryWorkTypeCategory } from "../../models/delivery-worktype-category.model.js";
import { DeliveryWorkType } from "../../models/master.model.js";

const httpCreateDeliveryWorkTypeCategory = async (req, res) => {
  try {
    const payload = req.body;
    const result = [];

    for (const item of payload) {
      const { deliveryWorkTypes, workTypeCategory, taskType, sequence } = item;

      // Find the corresponding DeliveryWorkType
      const deliveryWorkTypeDoc = await DeliveryWorkType.findOne({
        deliveryWorkTypes,
      });

      if (!deliveryWorkTypeDoc) {
        return res.status(400).json({
          error: `DeliveryWorkType '${deliveryWorkTypes}' not found.`,
        });
      }

      const created = await DeliveryWorkTypeCategory.create({
        deliveryWorkTypes,
        workTypeCategory,
        taskType,
        sequence,
        deliveryWorkTypesId: deliveryWorkTypeDoc._id,
      });

      result.push(created);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating DeliveryWorkTypeCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

export { httpCreateDeliveryWorkTypeCategory };
