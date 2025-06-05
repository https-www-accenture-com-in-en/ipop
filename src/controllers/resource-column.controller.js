import mongoose from "mongoose";
import resourceColumnModel from "../models/resource-column.model.js";

export const getAllResourceColumns = async (req, res) => {
  const columns = await resourceColumnModel.find().sort({ createdAt: 1 });
  res.status(200).json(columns);
};

export const bulkResourceColumnOperations = async (req, res) => {
  // Expecting a structure like: { resourceColumnOps: { create: [], update: [], delete: [] } }
  const { resource: rcOps } = req.body;

  if (!rcOps) {
    return res.status(400).json({
      message: "Missing 'resourceColumnOps' in request body.",
      details: {
        errors: [
          {
            type: "INVALID_REQUEST_BODY",
            message: "Request body must contain 'resourceColumnOps' object.",
          },
        ],
      },
    });
  }

  const results = {
    createdResourceColumns: [],
    updatedData: { resourceColumns: [] },
    deletedData: { resourceColumnIds: [] },
    errors: [],
  };
  const tempIdToNewIdMap = new Map(); // Useful for mapping tempIds to new DB IDs in response
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. Deletions
      if (rcOps.delete && rcOps.delete.length > 0) {
        const idsToDelete = rcOps.delete
          .map((op) => op.id)
          .filter((id) => id && mongoose.Types.ObjectId.isValid(id)); // Ensure ID is valid

        if (idsToDelete.length > 0) {
          // No dependent collections to worry about for ResourceColumn based on the schema
          const deleteResult = await resourceColumnModel.deleteMany(
            { _id: { $in: idsToDelete } },
            { session }
          );
          if (deleteResult.deletedCount > 0) {
            results.deletedData.resourceColumnIds.push(
              ...idsToDelete.filter(
                (id) =>
                  // A bit redundant, but ensures only actually potentially deleted IDs are reported
                  // Could also query which ones were actually deleted if strictness is needed.
                  // For now, just report what we attempted to delete.
                  true
              )
            );
          }
          // Optionally, check if deleteResult.deletedCount matches idsToDelete.length
          // and add errors if not all were found/deleted.
        }
      }

      // 2. Creations
      if (rcOps.create && rcOps.create.length > 0) {
        for (const op of rcOps.create) {
          // Frontend might send an _id if it was trying to "upsert" or if it's a temp id.
          // We ensure Mongoose generates a new _id by not passing it to the constructor.
          const { _id: tempFrontendId, ...rcDataForDb } = op.data;

          try {
            const newResourceColumn = new resourceColumnModel(rcDataForDb);
            await newResourceColumn.save({ session });

            if (op.tempId) {
              // If frontend sent a temporary ID
              tempIdToNewIdMap.set(op.tempId, newResourceColumn._id.toString());
            }
            results.createdResourceColumns.push({
              tempId: op.tempId, // Pass back the tempId for frontend mapping
              newResourceColumn: newResourceColumn.toObject(),
            });
          } catch (error) {
            let errorMessage = `ResourceColumn creation error: ${error.message}`;
            if (error.code === 11000) {
              // Duplicate key error
              errorMessage = `ResourceColumn creation error: Name '${rcDataForDb.name}' already exists.`;
            }
            results.errors.push({
              type: "CREATE_RC_ERROR",
              message: errorMessage,
              item: op.data, // Send back the data that failed
              errorDetails:
                error.code === 11000
                  ? { field: "name", value: rcDataForDb.name }
                  : undefined,
            });
          }
        }
      }

      // 3. Updates
      if (rcOps.update && rcOps.update.length > 0) {
        for (const op of rcOps.update) {
          if (op.id && mongoose.Types.ObjectId.isValid(op.id)) {
            // Remove _id from the update payload to prevent attempts to change it
            const { _id, ...updatePayload } = op.data;

            try {
              const updatedRc = await resourceColumnModel.findByIdAndUpdate(
                op.id,
                updatePayload,
                { new: true, runValidators: true, session }
              );
              if (updatedRc) {
                results.updatedData.resourceColumns.push(updatedRc.toObject());
              } else {
                results.errors.push({
                  type: "UPDATE_RC_ERROR",
                  message: `ResourceColumn with id ${op.id} not found for update.`,
                  item: op,
                });
              }
            } catch (error) {
              let errorMessage = `ResourceColumn update error for ID ${op.id}: ${error.message}`;
              if (error.code === 11000) {
                // Duplicate key error
                errorMessage = `ResourceColumn update error: Name '${updatePayload.name}' already exists.`;
              }
              results.errors.push({
                type: "UPDATE_RC_ERROR",
                message: errorMessage,
                item: op,
                errorDetails:
                  error.code === 11000
                    ? { field: "name", value: updatePayload.name }
                    : undefined,
              });
            }
          } else if (op.id && String(op.id).startsWith("temp_")) {
            results.errors.push({
              type: "UPDATE_RC_ERROR",
              message: `Cannot update ResourceColumn with temporary ID ${op.id}. It should have been created in this bulk operation or exist previously.`,
              item: op,
            });
          } else {
            results.errors.push({
              type: "UPDATE_RC_ERROR",
              message: `Invalid or missing ID for ResourceColumn update. Received: ${op.id}`,
              item: op,
            });
          }
        }
      }
    }); // End of transaction

    // After transaction, check for errors collected during operations
    if (results.errors.length > 0) {
      console.warn(
        "Bulk ResourceColumn operation completed with errors:",
        JSON.stringify(results.errors, null, 2)
      );

      return res
        .status(
          results.createdResourceColumns.length > 0 ||
            results.updatedData.resourceColumns.length > 0 ||
            results.deletedData.resourceColumnIds.length > 0
            ? 207
            : 400
        )
        .json({
          message:
            "Bulk ResourceColumn operation completed with one or more errors.",
          details: results,
        });
    }

    res.status(200).json(results);
  } catch (err) {
    // This catches errors that abort the transaction (e.g., DB connection issue, unhandled error in transaction)
    console.error(
      "Bulk ResourceColumn operation error (transaction aborted):",
      err
    );
    // Add the overall transaction error to the results, if not already captured
    if (!results.errors.some((e) => e.type === "TRANSACTION_ERROR")) {
      results.errors.push({
        type: "TRANSACTION_ERROR",
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Only show stack in dev
      });
    }
    res.status(500).json({
      message: "Bulk ResourceColumn operation failed. Changes rolled back.",
      details: { errors: results.errors }, // Send back any errors collected before transaction failure too
    });
  } finally {
    await session.endSession();
  }
};
