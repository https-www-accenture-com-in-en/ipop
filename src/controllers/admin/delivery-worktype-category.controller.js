import { DeliveryWorkTypeCategory } from "../../models/delivery-worktype-category.model.js";
import { DeliveryWorkType } from "../../models/master.model.js";

const httpGetTaskTypes = async (req, res) => {
  try {
    // Fetch all master work types and populate their delivery work types
    const data = await DeliveryWorkTypeCategory.find({}, { taskType: 1 });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching task types work types:", error);
    res.status(500).json({ error: error.message });
  }
};

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

export { httpGetTaskTypes, httpCreateDeliveryWorkTypeCategory };
