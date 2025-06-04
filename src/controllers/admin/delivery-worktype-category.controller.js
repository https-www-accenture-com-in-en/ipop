import mongoose from "mongoose";
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
  const session = await mongoose.startSession();
  try {
    const requestData = req.body;

    // Check if request body is an array
    if (!Array.isArray(requestData) || requestData.length === 0) {
      return res
        .status(400)
        .json({ message: "Request body must be a non-empty array." });
    }

    console.log("Received request data:", JSON.stringify(requestData, null, 2)); // Debug log

    await session.withTransaction(async () => {
      // Group the incoming data by deliveryWorkTypes to process efficiently
      const groupedByDeliveryWorkType = {};

      // First, validate all incoming records and group them
      for (const record of requestData) {
        const { deliveryWorkTypes, workTypeCategory, taskType, sequence } =
          record;

        // Validate required fields
        if (
          !deliveryWorkTypes ||
          !workTypeCategory ||
          !taskType ||
          typeof sequence !== "number"
        ) {
          throw new Error(
            `Invalid record: All fields (deliveryWorkTypes, workTypeCategory, taskType, sequence) are required. Received: ${JSON.stringify(
              record
            )}`
          );
        }

        // Group by deliveryWorkTypes
        if (!groupedByDeliveryWorkType[deliveryWorkTypes]) {
          groupedByDeliveryWorkType[deliveryWorkTypes] = [];
        }

        groupedByDeliveryWorkType[deliveryWorkTypes].push({
          workTypeCategory,
          taskType,
          sequence,
        });
      }

      // Process each delivery work type group
      for (const [deliveryWorkTypeName, categories] of Object.entries(
        groupedByDeliveryWorkType
      )) {
        // Find the corresponding DeliveryWorkType document to get the ID
        const deliveryWorkTypeDoc = await DeliveryWorkType.findOne({
          deliveryWorkTypes: deliveryWorkTypeName,
        });

        if (!deliveryWorkTypeDoc) {
          throw new Error(
            `DeliveryWorkType not found for: ${deliveryWorkTypeName}`
          );
        }

        const deliveryWorkTypesId = deliveryWorkTypeDoc._id;

        // Get all existing categories for this deliveryWorkTypesId
        const existingCategories = await DeliveryWorkTypeCategory.find({
          deliveryWorkTypesId,
        });

        // Create a map of existing categories using composite key (workTypeCategory + taskType)
        const existingMap = {};
        existingCategories.forEach((category) => {
          const key = `${category.workTypeCategory}-${category.taskType}`;
          existingMap[key] = category;
        });

        // Process incoming categories
        const incomingKeys = categories.map(
          (category) => `${category.workTypeCategory}-${category.taskType}`
        );

        // Upsert categories
        for (const category of categories) {
          const key = `${category.workTypeCategory}-${category.taskType}`;

          if (existingMap[key]) {
            // Update existing category
            await DeliveryWorkTypeCategory.updateOne(
              { _id: existingMap[key]._id },
              {
                $set: {
                  deliveryWorkTypes: deliveryWorkTypeName, // Update in case it changed
                  sequence: category.sequence,
                },
              }
            );
          } else {
            // Create new category
            await DeliveryWorkTypeCategory.create({
              deliveryWorkTypes: deliveryWorkTypeName,
              workTypeCategory: category.workTypeCategory,
              taskType: category.taskType,
              sequence: category.sequence,
              deliveryWorkTypesId,
            });
          }
        }

        // Delete categories that are no longer in the incoming data
        const toDelete = existingCategories.filter((category) => {
          const key = `${category.workTypeCategory}-${category.taskType}`;
          return !incomingKeys.includes(key);
        });

        if (toDelete.length > 0) {
          await DeliveryWorkTypeCategory.deleteMany({
            _id: { $in: toDelete.map((category) => category._id) },
          });
        }
      }
    });

    return res.status(200).json({
      message: "Delivery work type categories upserted successfully.",
    });
  } catch (error) {
    console.error("Error upserting delivery work type categories:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  } finally {
    session.endSession();
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

export const httpGetWorkTypeCategoryWithMWT = async (req, res) => {
  try {
    const { masterWorkTypes } = req.params;

    if (!masterWorkTypes) {
      return res
        .status(400)
        .json({ error: "masterWorkTypes is required in the URL" });
    }

    const masterWorkType = await MasterWorkType.findOne({ masterWorkTypes });

    if (!masterWorkType) {
      return res.status(404).json({ error: "MasterWorkType not found" });
    }

    const deliveryWorkTypes = await DeliveryWorkType.find({
      MasterWorkTypeId: masterWorkType._id,
    });

    const deliveryWorkTypesIds = deliveryWorkTypes.map((dw) => dw._id);

    const categories = await DeliveryWorkTypeCategory.find({
      deliveryWorkTypesId: { $in: deliveryWorkTypesIds },
    });

    const response = categories.map((cat) => ({
      id: cat._id,
      workTypeCategory: cat.workTypeCategory,
      deliveryWorkTypeId: cat.deliveryWorkTypesId,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching workTypeCategories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Get all DeliveryWorkTypeCategory with filtering options
// @route   GET /api/v1/admin/work-types/filter
export const httpGetAllWithParams = async (req, res) => {
  const { masterWorkTypeId, deliveryWorkTypeId, workTypeCategoryId } =
    req.query;

  try {
    // Condition 1: Filter by masterWorkTypeId
    if (masterWorkTypeId) {
      const master = await MasterWorkType.findById(masterWorkTypeId);
      if (!master)
        return res.status(404).json({ message: "Master Work Type not found" });

      const deliveryWorkTypes = await DeliveryWorkType.find({
        MasterWorkTypeId: master._id,
      });

      const deliveryWorkTypeData = await Promise.all(
        deliveryWorkTypes.map(async (dwt) => {
          const taskTypes = await DeliveryWorkTypeCategory.find({
            deliveryWorkTypesId: dwt._id,
          });

          return {
            id: dwt._id,
            deliveryWorkTypes: dwt.deliveryWorkTypes,
            taskTypes: taskTypes.map((t) => ({
              id: t._id,
              taskType: t.taskType,
              workTypeCategory: t.workTypeCategory,
              sequence: t.sequence,
            })),
          };
        })
      );

      return res.json([
        {
          masterWorkTypes: master.masterWorkTypes,
          id: master._id,
          deliveryWorkType: deliveryWorkTypeData,
        },
      ]);
    }

    // Condition 2: Filter by deliveryWorkTypeId
    if (deliveryWorkTypeId) {
      const dwt = await DeliveryWorkType.findById(deliveryWorkTypeId);
      if (!dwt)
        return res
          .status(404)
          .json({ message: "Delivery Work Type not found" });

      const taskTypes = await DeliveryWorkTypeCategory.find({
        deliveryWorkTypesId: dwt._id,
      });

      return res.json([
        {
          deliveryWorkTypes: dwt.deliveryWorkTypes,
          id: dwt._id,
          taskTypes: taskTypes.map((t) => ({
            id: t._id,
            taskType: t.taskType,
            workTypeCategory: t.workTypeCategory,
            sequence: t.sequence,
          })),
        },
      ]);
    }

    // Condition 3: Filter by workTypeCategoryId
    if (workTypeCategoryId) {
      const category = await DeliveryWorkTypeCategory.findById(
        workTypeCategoryId
      );
      if (!category)
        return res
          .status(404)
          .json({ message: "Work Type Category not found" });

      return res.json({
        workTypeCategoryId: category._id,
        taskTypes: [
          {
            id: category._id,
            taskType: category.taskType,
          },
        ],
      });
    }

    return res.status(400).json({
      message:
        "Please provide one of: masterWorkTypeId, deliveryWorkTypeId, or workTypeCategoryId",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
