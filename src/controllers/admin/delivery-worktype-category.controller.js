import { DeliveryWorkTypeCategory } from "../../models/delivery-worktype-category.model.js";
import { MasterWorkType, DeliveryWorkType } from "../../models/master.model.js";

// @desc    Get all task types
// @route   GET /api/v1/admin/task-types
export const httpGetTaskTypes = async (req, res) => {
  try {
    const data = await DeliveryWorkTypeCategory.find({}, { taskType: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching task types work types:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all DeliveryWorkTypeCategory
// @route   GET /api/v1/admin/task-types-with-mwt-dwt
export const httpGetAllWorkTypes = async (req, res) => {
  try {
    const data = await MasterWorkType.aggregate([
      {
        $lookup: {
          from: "deliveryworktypes",
          localField: "_id",
          foreignField: "MasterWorkTypeId",
          as: "deliveryWorkTypes",
        },
      },
      {
        $unwind: {
          path: "$deliveryWorkTypes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "deliveryworktypecategories", // 👈 Updated collection name here
          localField: "deliveryWorkTypes._id",
          foreignField: "deliveryWorkTypesId",
          as: "deliveryWorkTypes.taskTypes",
        },
      },
      {
        $group: {
          _id: "$_id",
          masterWorkTypes: { $first: "$masterWorkTypes" },
          deliveryWorkTypes: {
            $push: {
              id: "$deliveryWorkTypes._id",
              deliveryWorkTypes: "$deliveryWorkTypes.deliveryWorkTypes",
              sequence: "$deliveryWorkTypes.sequence",
              taskTypes: "$deliveryWorkTypes.taskTypes",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          masterWorkTypes: 1,
          deliveryWorkType: {
            $map: {
              input: "$deliveryWorkTypes",
              as: "d",
              in: {
                id: "$$d.id",
                deliveryWorkTypes: "$$d.deliveryWorkTypes",
                sequence: "$$d.sequence",
                taskTypes: {
                  $map: {
                    input: "$$d.taskTypes",
                    as: "t",
                    in: {
                      id: "$$t._id",
                      taskType: "$$t.taskType",
                      workTypeCategory: "$$t.workTypeCategory",
                      sequence: "$$t.sequence",
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Create DeliveryWorkTypeCategory
// @route   POST /api/v1/admin/delivery-work-type-category
export const httpCreateDeliveryWorkTypeCategory = async (req, res) => {
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

// @desc    Edit DeliveryWorkTypeCategory
// @route   PATCH /api/v1/admin/task-types/bulk-edit
export const httpEditTaskTypes = async (req, res) => {
  try {
    const updates = req.body;

    const updatePromises = updates.map(async (item) => {
      const { id, ...updateFields } = item;

      if (!id) return;

      return DeliveryWorkTypeCategory.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      );
    });

    const results = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Delivery Work Type Categories updated successfully",
      updated: results.filter(Boolean), // remove undefined in case of missing ids
    });
  } catch (error) {
    console.error("Error updating DeliveryWorkTypeCategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
