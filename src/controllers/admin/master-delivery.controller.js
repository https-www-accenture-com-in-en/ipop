import mongoose from "mongoose";
import {
  MasterWorkType,
  DeliveryWorkType,
  UIType,
} from "../../models/master.model.js";

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

export const httpGetDeliveryWTByMWT = async (req, res) => {
  try {
    const { masterWorkTypeId } = req.params;
    const data = await DeliveryWorkType.find({
      MasterWorkTypeId: masterWorkTypeId,
    });
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

export const httpEditWorkTypes = async (req, res) => {
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

export const httpBulkWorkTypeOperations = async (req, res) => {
  // Renamed for clarity:
  // clusterOps -> masterWorkTypeOps (mwtOps)
  // cvOps -> deliveryWorkTypeOps (dwtOps)
  const { MasterWorkTypeId: mwtOps, DeliveryWorkTypeId: dwtOps } = req.body;
  console.log("Bulk work type operations received:", req.body);
  const results = {
    createdMasterWorkTypes: [],
    createdDeliveryWorkTypes: [],
    updatedData: { masterWorkTypes: [], deliveryWorkTypes: [] },
    deletedData: { masterWorkTypeIds: [], deliveryWorkTypeIds: [] },
    errors: [],
  };
  const tempIdToNewIdMap = new Map();
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. Deletions (DeliveryWorkTypes first due to FK, then MasterWorkTypes)
      if (dwtOps && dwtOps.delete && dwtOps.delete.length > 0) {
        const idsToDelete = dwtOps.delete
          .map((op) => op.id)
          .filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (idsToDelete.length > 0) {
          await DeliveryWorkType.deleteMany(
            { _id: { $in: idsToDelete } },
            { session }
          );
          results.deletedData.deliveryWorkTypeIds.push(...idsToDelete);
        }
      }
      if (mwtOps && mwtOps.delete && mwtOps.delete.length > 0) {
        const idsToDelete = mwtOps.delete
          .map((op) => op.id)
          .filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (idsToDelete.length > 0) {
          // Delete associated DeliveryWorkTypes first
          await DeliveryWorkType.deleteMany(
            { MasterWorkTypeId: { $in: idsToDelete } },
            { session }
          );
          await MasterWorkType.deleteMany(
            { _id: { $in: idsToDelete } },
            { session }
          );
          results.deletedData.masterWorkTypeIds.push(...idsToDelete);
        }
      }

      // 2. Creations (MasterWorkTypes first, then DeliveryWorkTypes to resolve FKs)
      if (mwtOps && mwtOps.create && mwtOps.create.length > 0) {
        for (const op of mwtOps.create) {
          const { _id: tempFrontendId, ...mwtDataForDb } = op.data;
          const newMasterWorkType = new MasterWorkType(mwtDataForDb);
          await newMasterWorkType.save({ session });
          tempIdToNewIdMap.set(op.tempId, newMasterWorkType._id.toString());
          results.createdMasterWorkTypes.push({
            tempId: op.tempId,
            newMasterWorkType: newMasterWorkType.toObject(),
          });
        }
      }

      if (dwtOps && dwtOps.create && dwtOps.create.length > 0) {
        for (const op of dwtOps.create) {
          const { _id: tempFrontendId, ...dwtDataForDb } = op.data;
          let masterWorkTypeFk = dwtDataForDb.MasterWorkTypeId; // FK field name

          if (masterWorkTypeFk && tempIdToNewIdMap.has(masterWorkTypeFk)) {
            dwtDataForDb.MasterWorkTypeId =
              tempIdToNewIdMap.get(masterWorkTypeFk);
          } else if (
            masterWorkTypeFk &&
            String(masterWorkTypeFk).startsWith("temp_")
          ) {
            results.errors.push({
              type: "CREATE_DWT_ERROR",
              message: `DeliveryWorkType creation error: Temp MasterWorkTypeId ${masterWorkTypeFk} not resolved.`,
              item: op,
            });
            continue;
          }

          if (
            !dwtDataForDb.MasterWorkTypeId ||
            !mongoose.Types.ObjectId.isValid(dwtDataForDb.MasterWorkTypeId)
          ) {
            results.errors.push({
              type: "CREATE_DWT_ERROR",
              message: `DeliveryWorkType creation error: Invalid or missing MasterWorkTypeId for ${dwtDataForDb.deliveryWorkTypes}. MasterWorkTypeId was: ${dwtDataForDb.MasterWorkTypeId}`,
              item: op,
            });
            continue;
          }

          const newDeliveryWorkType = new DeliveryWorkType(dwtDataForDb);
          await newDeliveryWorkType.save({ session });
          results.createdDeliveryWorkTypes.push({
            tempId: op.tempId,
            newDeliveryWorkType: newDeliveryWorkType.toObject(),
          });
        }
      }

      // 3. Updates
      if (mwtOps && mwtOps.update && mwtOps.update.length > 0) {
        for (const op of mwtOps.update) {
          if (op.id && mongoose.Types.ObjectId.isValid(op.id)) {
            const { _id, ...updatePayload } = op.data; // _id from payload is ignored for update
            const updatedMasterWorkType =
              await MasterWorkType.findByIdAndUpdate(op.id, updatePayload, {
                new: true,
                runValidators: true,
                session,
              });
            if (updatedMasterWorkType)
              results.updatedData.masterWorkTypes.push(
                updatedMasterWorkType.toObject()
              );
            else
              results.errors.push({
                type: "UPDATE_MWT_ERROR",
                message: `MasterWorkType with id ${op.id} not found for update.`,
                item: op,
              });
          } else if (op.id && op.id.startsWith("temp_")) {
            results.errors.push({
              type: "UPDATE_MWT_ERROR",
              message: `Cannot update MasterWorkType with temporary ID ${op.id}. It should have been created.`,
              item: op,
            });
          } else {
            results.errors.push({
              type: "UPDATE_MWT_ERROR",
              message: `Invalid or missing ID for MasterWorkType update. ID was: ${op.id}`,
              item: op,
            });
          }
        }
      }
      if (dwtOps && dwtOps.update && dwtOps.update.length > 0) {
        for (const op of dwtOps.update) {
          if (op.id && mongoose.Types.ObjectId.isValid(op.id)) {
            let {
              _id,
              MasterWorkTypeId: masterWorkTypeFk,
              ...updatePayload
            } = op.data; // FK field name

            if (masterWorkTypeFk && tempIdToNewIdMap.has(masterWorkTypeFk)) {
              updatePayload.MasterWorkTypeId =
                tempIdToNewIdMap.get(masterWorkTypeFk);
            } else if (
              masterWorkTypeFk &&
              String(masterWorkTypeFk).startsWith("temp_")
            ) {
              results.errors.push({
                type: "UPDATE_DWT_ERROR",
                message: `DeliveryWorkType update error: Temp MasterWorkTypeId ${masterWorkTypeFk} not resolved.`,
                item: op,
              });
              continue;
            } else if (
              masterWorkTypeFk &&
              !mongoose.Types.ObjectId.isValid(masterWorkTypeFk)
            ) {
              results.errors.push({
                type: "UPDATE_DWT_ERROR",
                message: `DeliveryWorkType update error: Invalid MasterWorkTypeId ${masterWorkTypeFk}.`,
                item: op,
              });
              continue;
            } else {
              // If masterWorkTypeFk is a valid ObjectId (not temp) or undefined (not updating FK),
              // ensure it's set in updatePayload if provided
              if (masterWorkTypeFk)
                updatePayload.MasterWorkTypeId = masterWorkTypeFk;
            }

            const updatedDwt = await DeliveryWorkType.findByIdAndUpdate(
              op.id,
              updatePayload,
              { new: true, runValidators: true, session }
            );
            if (updatedDwt)
              results.updatedData.deliveryWorkTypes.push(updatedDwt.toObject());
            else
              results.errors.push({
                type: "UPDATE_DWT_ERROR",
                message: `DeliveryWorkType with id ${op.id} not found for update.`,
                item: op,
              });
          } else if (op.id && op.id.startsWith("temp_")) {
            results.errors.push({
              type: "UPDATE_DWT_ERROR",
              message: `Cannot update DeliveryWorkType with temporary ID ${op.id}. It should have been created.`,
              item: op,
            });
          } else {
            results.errors.push({
              type: "UPDATE_DWT_ERROR",
              message: `Invalid or missing ID for DeliveryWorkType update. ID was: ${op.id}`,
              item: op,
            });
          }
        }
      }
    }); // End of transaction

    if (results.errors.length > 0) {
      console.warn(
        "Bulk operation completed with errors:",
        JSON.stringify(results.errors, null, 2)
      );
      // It's better to send the whole results object so frontend knows what succeeded/failed
      res.status(400).json({
        message: "Bulk operation completed with errors.",
        details: results,
      });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Bulk operation error (transaction likely aborted):", err);
    results.errors.push({
      type: "TRANSACTION_ERROR",
      message: err.message,
      stack: err.stack,
    }); // Add stack in dev
    // Send the whole results object here too, as some non-transactional errors might have been populated
    res.status(500).json({
      error: "Bulk operation failed. Changes likely rolled back.",
      details: results,
    });
  } finally {
    session.endSession();
  }
};

// GET /api/uitypes
export const httpGetUITypes = async (req, res) => {
  try {
    const uitypes = await UIType.find();
    res.status(200).json(uitypes);
  } catch (error) {
    console.error("Error fetching UI types:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const httpUpdateUIType = async (req, res) => {
  try {
    const uitypes = await UIType.find();

    const { uitype } = req.body;
    const fetcheduitype = uitypes[0];

    fetcheduitype.uitype = uitype;

    await fetcheduitype.save();

    res
      .status(200)
      .json({ message: "UIType updated successfully.", data: fetcheduitype });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating UIType." });
  }
};
