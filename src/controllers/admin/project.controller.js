import mongoose from "mongoose";
import { MasterProject, SubProject } from "../../models/project.model.js";

// ========== Master Project ==========

// Add Master Project
const addMasterProject = async (req, res) => {
  const { name } = req.body;
  const master = new MasterProject({ name });
  await master.save();
  res.status(201).json(master);
};

// Get all Master Projects
const getAllMasterProjects = async (req, res) => {
  const projects = await MasterProject.find();
  res.status(200).json(projects);
};

// Get Master Project by ID
const getMasterProjectById = async (req, res) => {
  const { id } = req.params;
  const project = await MasterProject.findById(id).populate("subprojects");
  if (!project) return res.status(404).json({ message: "Not found" });
  res.status(200).json(project);
};

// Update Master Project
const updateMasterProject = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updated = await MasterProject.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.status(200).json(updated);
};

// Delete Master Project and its subprojects
const deleteMasterProject = async (req, res) => {
  const { id } = req.params;
  const master = await MasterProject.findById(id);
  if (!master) return res.status(404).json({ message: "Not found" });

  await SubProject.deleteMany({ _id: { $in: master.subprojects } });
  await MasterProject.findByIdAndDelete(id);

  res.status(200).json({ message: "Master Project and subprojects deleted" });
};

// ========== Sub Project ==========

// Add SubProject and link to Master
const addSubProject = async (req, res) => {
  const { name, masterProject } = req.body;

  const sub = new SubProject({ name, masterProject });
  await sub.save();

  await MasterProject.findByIdAndUpdate(masterProject, {
    $push: { subprojects: sub._id },
  });

  res.status(201).json(sub);
};

// Get all SubProjects
const getAllSubProjects = async (req, res) => {
  const subs = await SubProject.find().populate("masterProject");
  res.status(200).json(subs);
};

// Get SubProject by Master Project ID
const getAllSubProjectsById = async (req, res) => {
  const { id } = req.params;
  const subs = await SubProject.find({ masterProject: id }).populate(
    "masterProject"
  );
  if (!subs) return res.status(404).json({ message: "Not found" });
  res.status(200).json(subs);
};

// Get SubProject by ID
const getSubProjectById = async (req, res) => {
  const { id } = req.params;
  console.log("ID", id);
  const sub = await SubProject.findById(id).populate("masterProject");
  if (!sub) return res.status(404).json({ message: "Not found" });
  res.status(200).json(sub);
};

// Update SubProject
const updateSubProject = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const sub = await SubProject.findById(id);
  if (!sub) return res.status(404).json({ message: "Not found" });

  sub.name = name;
  await sub.save();

  res.status(200).json(sub);
};

// Delete SubProject
const deleteSubProject = async (req, res) => {
  const { id } = req.params;

  const sub = await SubProject.findById(id);
  if (!sub) return res.status(404).json({ message: "Not found" });

  await MasterProject.findByIdAndUpdate(sub.masterProject, {
    $pull: { subprojects: sub._id },
  });

  await SubProject.findByIdAndDelete(id);

  res.status(200).json({ message: "Subproject deleted" });
};

export const httpBulkProjectOperations = async (req, res) => {
  const { masterProject: mpOps, subProject: spOps } = req.body;
  console.log("Bulk project operations request body:", req.body);
  console.log("create", req.body.masterProject?.create);
  const results = {
    createdMasterProjects: [],
    createdSubProjects: [],
    updatedData: { masterProjects: [], subProjects: [] },
    deletedData: { masterProjectIds: [], subProjectIds: [] },
    errors: [],
  };
  const tempIdToNewIdMap = new Map(); // For mapping frontend temp IDs to DB-generated ObjectIds
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. Deletions (SubProjects first, then MasterProjects to handle dependencies)
      if (spOps && spOps.delete && spOps.delete.length > 0) {
        const idsToDelete = spOps.delete
          .map((op) => op.id)
          .filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (idsToDelete.length > 0) {
          await SubProject.deleteMany(
            { _id: { $in: idsToDelete } },
            { session }
          );
          results.deletedData.subProjectIds.push(...idsToDelete);
        }
      }

      if (mpOps && mpOps.delete && mpOps.delete.length > 0) {
        const idsToDelete = mpOps.delete
          .map((op) => op.id)
          .filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (idsToDelete.length > 0) {
          // Delete all SubProjects associated with the MasterProjects being deleted
          await SubProject.deleteMany(
            { masterProject: { $in: idsToDelete } },
            { session }
          );
          // Then delete the MasterProjects
          await MasterProject.deleteMany(
            { _id: { $in: idsToDelete } },
            { session }
          );
          results.deletedData.masterProjectIds.push(...idsToDelete);
        }
      }

      // 2. Creations (MasterProjects first, then SubProjects to resolve FKs)
      if (mpOps && mpOps.create && mpOps.create.length > 0) {
        for (const op of mpOps.create) {
          const { _id: tempFrontendId, ...mpDataForDb } = op.data; // _id from frontend is ignored
          const newMasterProject = new MasterProject(mpDataForDb);
          await newMasterProject.save({ session });
          tempIdToNewIdMap.set(op.tempId, newMasterProject._id.toString());
          results.createdMasterProjects.push({
            tempId: op.tempId,
            newMasterProject: newMasterProject.toObject(),
          });
        }
      }

      if (spOps && spOps.create && spOps.create.length > 0) {
        for (const op of spOps.create) {
          const { _id: tempFrontendId, ...spDataForDb } = op.data; // _id from frontend is ignored
          let masterProjectFk = spDataForDb.masterProject;

          if (masterProjectFk && tempIdToNewIdMap.has(masterProjectFk)) {
            spDataForDb.masterProject = tempIdToNewIdMap.get(masterProjectFk);
          } else if (
            masterProjectFk &&
            String(masterProjectFk).startsWith("temp_")
          ) {
            results.errors.push({
              type: "CREATE_SP_ERROR",
              message: `SubProject creation error: Temp masterProject ID ${masterProjectFk} not resolved.`,
              item: op,
            });
            continue;
          }

          if (
            !spDataForDb.masterProject ||
            !mongoose.Types.ObjectId.isValid(spDataForDb.masterProject)
          ) {
            results.errors.push({
              type: "CREATE_SP_ERROR",
              message: `SubProject creation error: Invalid or missing masterProject ID for ${spDataForDb.name}. MasterProject ID was: ${spDataForDb.masterProject}`,
              item: op,
            });
            continue;
          }

          const newSubProject = new SubProject(spDataForDb);
          await newSubProject.save({ session });
          results.createdSubProjects.push({
            tempId: op.tempId,
            newSubProject: newSubProject.toObject(),
          });
          // No need to update MasterProject's subprojects array
        }
      }

      // 3. Updates
      if (mpOps && mpOps.update && mpOps.update.length > 0) {
        for (const op of mpOps.update) {
          if (op.id && mongoose.Types.ObjectId.isValid(op.id)) {
            const { _id, ...updatePayload } = op.data; // _id from payload is ignored
            const updatedMasterProject = await MasterProject.findByIdAndUpdate(
              op.id,
              updatePayload,
              { new: true, runValidators: true, session }
            );
            if (updatedMasterProject)
              results.updatedData.masterProjects.push(
                updatedMasterProject.toObject()
              );
            else
              results.errors.push({
                type: "UPDATE_MP_ERROR",
                message: `MasterProject with id ${op.id} not found for update.`,
                item: op,
              });
          } else if (op.id && String(op.id).startsWith("temp_")) {
            results.errors.push({
              type: "UPDATE_MP_ERROR",
              message: `Cannot update MasterProject with temporary ID ${op.id}. It should have been created.`,
              item: op,
            });
          }
        }
      }
      if (spOps && spOps.update && spOps.update.length > 0) {
        for (const op of spOps.update) {
          if (op.id && mongoose.Types.ObjectId.isValid(op.id)) {
            let {
              _id,
              masterProject: masterProjectFk,
              ...updatePayload
            } = op.data; // _id from payload is ignored

            if (masterProjectFk && tempIdToNewIdMap.has(masterProjectFk)) {
              updatePayload.masterProject =
                tempIdToNewIdMap.get(masterProjectFk);
            } else if (
              masterProjectFk &&
              String(masterProjectFk).startsWith("temp_")
            ) {
              results.errors.push({
                type: "UPDATE_SP_ERROR",
                message: `SubProject update error: Temp masterProject ID ${masterProjectFk} not resolved.`,
                item: op,
              });
              continue;
            } else if (
              masterProjectFk &&
              !mongoose.Types.ObjectId.isValid(masterProjectFk)
            ) {
              results.errors.push({
                type: "UPDATE_SP_ERROR",
                message: `SubProject update error: Invalid masterProject ID ${masterProjectFk}.`,
                item: op,
              });
              continue;
            } else if (masterProjectFk) {
              // It's a valid ObjectId string (or already converted from tempId)
              updatePayload.masterProject = masterProjectFk;
            }
            // If masterProjectFk is not provided in op.data, updatePayload.masterProject will not be set,
            // so findByIdAndUpdate will not change the existing masterProject reference in the DB, which is correct.

            const updatedSp = await SubProject.findByIdAndUpdate(
              op.id,
              updatePayload,
              { new: true, runValidators: true, session }
            );
            if (updatedSp) {
              results.updatedData.subProjects.push(updatedSp.toObject());
              // No need to update MasterProject's subprojects array
            } else {
              results.errors.push({
                type: "UPDATE_SP_ERROR",
                message: `SubProject with id ${op.id} not found for update.`,
                item: op,
              });
            }
          } else if (op.id && String(op.id).startsWith("temp_")) {
            results.errors.push({
              type: "UPDATE_SP_ERROR",
              message: `Cannot update SubProject with temporary ID ${op.id}. It should have been created.`,
              item: op,
            });
          }
        }
      }
    }); // End of session.withTransaction

    if (results.errors.length > 0) {
      console.warn(
        "Bulk project operation completed with errors:",
        JSON.stringify(results.errors, null, 2)
      );
      res.status(400).json({
        message: "Bulk operation completed with some errors.",
        details: results,
      });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Bulk project operation error (transaction aborted):", err);
    if (!results.errors.some((e) => e.type === "TRANSACTION_ERROR")) {
      results.errors.push({
        type: "TRANSACTION_ERROR",
        message: err.message,
        stack: err.stack,
        item: req.body,
      });
    }
    res.status(500).json({
      message: "Bulk operation failed. Changes rolled back.",
      details: results.errors,
    });
  } finally {
    session.endSession();
  }
};

// Update SubProject Estimation
const updateSubProjectEstimation = async (req, res) => {
  const { id } = req.params; // ID of the SubProject to update
  const { estimationPersonDays, etlPersonDays } = req.body;

  try {
    // Validate input
    if (estimationPersonDays === undefined || etlPersonDays === undefined) {
      return res.status(400).json({
        message: "Both estimationPersonDays and etlPersonDays are required.",
      });
    }
    if (typeof estimationPersonDays !== "number" || estimationPersonDays < 1) {
      return res.status(400).json({
        message:
          "estimationPersonDays must be a number greater than or equal to 1.",
      });
    }
    if (typeof etlPersonDays !== "number" || etlPersonDays < 0) {
      return res.status(400).json({
        message: "etlPersonDays must be a number greater than or equal to 0.",
      });
    }

    const updatedSubProject = await SubProject.findByIdAndUpdate(
      id,
      {
        estimationPersonDays,
        etlPersonDays,
      },
      { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures schema validation
    ).populate("masterProject");

    if (!updatedSubProject) {
      return res.status(404).json({ message: "Sub-Project not found" });
    }

    res.status(200).json(updatedSubProject);
  } catch (error) {
    console.error("Error updating sub-project estimation:", error);
    // Check for Mongoose validation errors
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Validation Error", errors });
    }
    res.status(500).json({
      message: "Server error while updating sub-project",
      error: error.message,
    });
  }
};

const updateEffortTables = async (req, res) => {
  const { id } = req.params;
  const { estimationEffortTable, etlEffortTable } = req.body;
  console.log("Updating effort tables for subproject ID:", req.body);
  if (!Array.isArray(estimationEffortTable) || !Array.isArray(etlEffortTable)) {
    return res.status(400).json({ message: "Both tables must be arrays." });
  }

  try {
    const updated = await SubProject.findByIdAndUpdate(
      id,
      {
        estimationEffortTable,
        etlEffortTable,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subproject not found." });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating effort tables:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getEffortTables = async (req, res) => {
  const { id } = req.params;

  try {
    const subProject = await SubProject.findById(id).select(
      "estimationEffortTable etlEffortTable"
    );

    if (!subProject) {
      return res.status(404).json({ message: "SubProject not found." });
    }

    res.status(200).json({
      estimationEffortTable: subProject.estimationEffortTable,
      etlEffortTable: subProject.etlEffortTable,
    });
  } catch (err) {
    console.error("Error fetching effort tables:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  addMasterProject,
  getAllMasterProjects,
  getMasterProjectById,
  updateMasterProject,
  deleteMasterProject,
  addSubProject,
  getAllSubProjects,
  getAllSubProjectsById,
  updateSubProjectEstimation,
  getSubProjectById,
  updateSubProject,
  deleteSubProject,
  updateEffortTables,
  getEffortTables,
};
