import mongoose from 'mongoose';
import { TaskType, WorkCategory, WorkSubCategory, WorkItem } from '../../models/non-ticket-delivery-worktype-category.model.js'; // Adjust path as needed

// --- TaskType CRUD Operations ---

export const httpAddTaskType = async (req, res) => {
  try {
    const taskType = await TaskType.create(req.body);
    res.status(201).json(taskType);
  } catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'TaskType name must be unique.', fields: err.keyValue });
    }
    res.status(500).json({ error: err.message });
  }
};

export const httpGetTaskTypes = async (req, res) => {
  try {
    const taskTypes = await TaskType.find();
    res.status(200).json(taskTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetTaskTypeById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid TaskType ID format' });
    }
    const taskType = await TaskType.findById(req.params.id);
    if (!taskType) {
      return res.status(404).json({ message: 'TaskType not found' });
    }
    res.status(200).json(taskType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpUpdateTaskType = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid TaskType ID format' });
    }
    const updatedTaskType = await TaskType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTaskType) {
      return res.status(404).json({ message: 'TaskType not found' });
    }
    res.status(200).json(updatedTaskType);
  } catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'TaskType name must be unique.', fields: err.keyValue });
    }
    res.status(500).json({ error: err.message });
  }
};

export const httpDeleteTaskType = async (req, res) => {
  const taskTypeId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskTypeId)) {
    return res.status(400).json({ message: 'Invalid TaskType ID format' });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (currentSession) => {
      const taskType = await TaskType.findById(taskTypeId).session(currentSession);
      if (!taskType) {
        const error = new Error('TaskType not found');
        error.statusCode = 404;
        throw error;
      }

      const workCategoriesToDelete = await WorkCategory.find({ taskType: taskTypeId }).select('_id').session(currentSession);
      const workCategoryIdsToDelete = workCategoriesToDelete.map(wc => wc._id);

      if (workCategoryIdsToDelete.length > 0) {
        const workSubCategoriesToDelete = await WorkSubCategory.find({ workCategory: { $in: workCategoryIdsToDelete } }).select('_id').session(currentSession);
        const workSubCategoryIdsToDelete = workSubCategoriesToDelete.map(wsc => wsc._id);

        if (workSubCategoryIdsToDelete.length > 0) {
          await WorkItem.deleteMany({ workSubCategory: { $in: workSubCategoryIdsToDelete } }).session(currentSession);
          await WorkSubCategory.deleteMany({ _id: { $in: workSubCategoryIdsToDelete } }).session(currentSession);
        }
        await WorkItem.deleteMany({ workCategory: { $in: workCategoryIdsToDelete } }).session(currentSession);
        await WorkCategory.deleteMany({ _id: { $in: workCategoryIdsToDelete } }).session(currentSession);
      }
      await TaskType.findByIdAndDelete(taskTypeId).session(currentSession);
    });
    res.status(204).send();
  } catch (err) {
    if (err.statusCode === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ error: 'Failed to cascade delete TaskType: ' + err.message });
  } finally {
    session.endSession();
  }
};

// --- WorkCategory CRUD Operations ---

export const httpAddWorkCategory = async (req, res) => {
  try {
    const workCategory = await WorkCategory.create(req.body);
    const populated = await WorkCategory.findById(workCategory._id).populate('taskType');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetWorkCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.taskTypeId && mongoose.Types.ObjectId.isValid(req.query.taskTypeId)) {
      filter.taskType = req.query.taskTypeId;
    }
    const workCategories = await WorkCategory.find(filter).populate('taskType');
    res.status(200).json(workCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetWorkCategoryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkCategory ID format' });
    }
    const workCategory = await WorkCategory.findById(req.params.id).populate('taskType');
    if (!workCategory) {
      return res.status(404).json({ message: 'WorkCategory not found' });
    }
    res.status(200).json(workCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpUpdateWorkCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkCategory ID format' });
    }
    const updatedWorkCategory = await WorkCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('taskType');
    if (!updatedWorkCategory) {
      return res.status(404).json({ message: 'WorkCategory not found' });
    }
    res.status(200).json(updatedWorkCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpDeleteWorkCategory = async (req, res) => {
  const workCategoryId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(workCategoryId)) {
    return res.status(400).json({ message: 'Invalid WorkCategory ID format' });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (currentSession) => {
      const workCategory = await WorkCategory.findById(workCategoryId).session(currentSession);
      if (!workCategory) {
        const error = new Error('WorkCategory not found');
        error.statusCode = 404;
        throw error;
      }

      const workSubCategoriesToDelete = await WorkSubCategory.find({ workCategory: workCategoryId }).select('_id').session(currentSession);
      const workSubCategoryIdsToDelete = workSubCategoriesToDelete.map(wsc => wsc._id);

      if (workSubCategoryIdsToDelete.length > 0) {
        await WorkItem.deleteMany({ workSubCategory: { $in: workSubCategoryIdsToDelete } }).session(currentSession);
        await WorkSubCategory.deleteMany({ _id: { $in: workSubCategoryIdsToDelete } }).session(currentSession);
      }
      await WorkItem.deleteMany({ workCategory: workCategoryId }).session(currentSession);
      await WorkCategory.findByIdAndDelete(workCategoryId).session(currentSession);
    });
    res.status(204).send();
  } catch (err) {
    if (err.statusCode === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ error: 'Failed to cascade delete WorkCategory: ' + err.message });
  } finally {
    session.endSession();
  }
};

// --- WorkSubCategory CRUD Operations ---

export const httpAddWorkSubCategory = async (req, res) => {
  try {
    const workSubCategory = await WorkSubCategory.create(req.body);
    const populated = await WorkSubCategory.findById(workSubCategory._id).populate({ path: 'workCategory', populate: { path: 'taskType' }});
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetWorkSubCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.workCategoryId && mongoose.Types.ObjectId.isValid(req.query.workCategoryId)) {
      filter.workCategory = req.query.workCategoryId;
    }
    const workSubCategories = await WorkSubCategory.find(filter).populate({
        path: 'workCategory',
        populate: { path: 'taskType' }
    });
    res.status(200).json(workSubCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetWorkSubCategoryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkSubCategory ID format' });
    }
    const workSubCategory = await WorkSubCategory.findById(req.params.id).populate({
        path: 'workCategory',
        populate: { path: 'taskType' }
    });
    if (!workSubCategory) {
      return res.status(404).json({ message: 'WorkSubCategory not found' });
    }
    res.status(200).json(workSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpUpdateWorkSubCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkSubCategory ID format' });
    }
    const updatedWorkSubCategory = await WorkSubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate({
        path: 'workCategory',
        populate: { path: 'taskType' }
    });
    if (!updatedWorkSubCategory) {
      return res.status(404).json({ message: 'WorkSubCategory not found' });
    }
    res.status(200).json(updatedWorkSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpDeleteWorkSubCategory = async (req, res) => {
  const workSubCategoryId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(workSubCategoryId)) {
    return res.status(400).json({ message: 'Invalid WorkSubCategory ID format' });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (currentSession) => {
      const workSubCategory = await WorkSubCategory.findById(workSubCategoryId).session(currentSession);
      if (!workSubCategory) {
        const error = new Error('WorkSubCategory not found');
        error.statusCode = 404;
        throw error;
      }
      await WorkItem.deleteMany({ workSubCategory: workSubCategoryId }).session(currentSession);
      await WorkSubCategory.findByIdAndDelete(workSubCategoryId).session(currentSession);
    });
    res.status(204).send();
  } catch (err) {
    if (err.statusCode === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ error: 'Failed to cascade delete WorkSubCategory: ' + err.message });
  } finally {
    session.endSession();
  }
};

// --- WorkItem CRUD Operations ---

export const httpAddWorkItem = async (req, res) => {
  try {
    const workItem = await WorkItem.create(req.body);
    const populated = await WorkItem.findById(workItem._id)
        .populate({ path: 'workCategory', populate: { path: 'taskType' } })
        .populate({ path: 'workSubCategory', populate: { path: 'workCategory', populate: { path: 'taskType' } } });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetWorkItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.workCategoryId && mongoose.Types.ObjectId.isValid(req.query.workCategoryId)) {
      filter.workCategory = req.query.workCategoryId;
    }
    if (req.query.workSubCategoryId && mongoose.Types.ObjectId.isValid(req.query.workSubCategoryId)) {
      filter.workSubCategory = req.query.workSubCategoryId;
    } else if ( req.query.workSubCategoryId === 'null') {
        filter.workSubCategory = null;
    }

    const workItems = await WorkItem.find(filter)
      .populate({ path: 'workCategory', populate: { path: 'taskType' } })
      .populate({ path: 'workSubCategory', populate: { path: 'workCategory', populate: { path: 'taskType' } } });
    res.status(200).json(workItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetWorkItemById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkItem ID format' });
    }
    const workItem = await WorkItem.findById(req.params.id)
      .populate({ path: 'workCategory', populate: { path: 'taskType' } })
      .populate({ path: 'workSubCategory', populate: { path: 'workCategory', populate: { path: 'taskType' } } });
    if (!workItem) {
      return res.status(404).json({ message: 'WorkItem not found' });
    }
    res.status(200).json(workItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpUpdateWorkItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkItem ID format' });
    }
    const updatedWorkItem = await WorkItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate({ path: 'workCategory', populate: { path: 'taskType' } })
      .populate({ path: 'workSubCategory', populate: { path: 'workCategory', populate: { path: 'taskType' } } });
    if (!updatedWorkItem) {
      return res.status(404).json({ message: 'WorkItem not found' });
    }
    res.status(200).json(updatedWorkItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpDeleteWorkItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkItem ID format' });
    }
    const deletedWorkItem = await WorkItem.findByIdAndDelete(req.params.id);
    if (!deletedWorkItem) {
      return res.status(404).json({ message: 'WorkItem not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpBulkWorkOperations = async (req, res) => {
    // Destructure the payload based on frontend structure
    const {
        taskTypes: taskTypeOps,
        workCategories: workCategoryOps,
        workSubCategories: workSubCategoryOps,
        workItems: workItemOps
    } = req.body;

    const results = {
        createdTaskTypes: [],
        createdWorkCategories: [],
        createdWorkSubCategories: [],
        createdWorkItems: [],
        updatedData: {
            taskTypes: [],
            workCategories: [],
            workSubCategories: [],
            workItems: [],
        },
        deletedData: {
            taskTypesIds: [],
            workCategoriesIds: [],
            workSubCategoriesIds: [],
            workItemsIds: [],
        },
        errors: []
    };

    const tempIdToNewIdMap = new Map();
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async (currentSession) => {
            // --- DELETIONS ---
            // WorkItems
            if (workItemOps?.delete?.length) {
                const idsToDelete = workItemOps.delete.map(op => op.id).filter(id => mongoose.Types.ObjectId.isValid(id) && !String(id).startsWith('temp_'));
                if (idsToDelete.length > 0) {
                    await WorkItem.deleteMany({ _id: { $in: idsToDelete } }, { session: currentSession });
                    results.deletedData.workItemsIds.push(...idsToDelete);
                }
            }

            // WorkSubCategories (and cascade to WorkItems)
            if (workSubCategoryOps?.delete?.length) {
                const idsToDelete = workSubCategoryOps.delete.map(op => op.id).filter(id => mongoose.Types.ObjectId.isValid(id) && !String(id).startsWith('temp_'));
                if (idsToDelete.length > 0) {
                    await WorkItem.deleteMany({ workSubCategory: { $in: idsToDelete } }, { session: currentSession }); // Cascade
                    await WorkSubCategory.deleteMany({ _id: { $in: idsToDelete } }, { session: currentSession });
                    results.deletedData.workSubCategoriesIds.push(...idsToDelete);
                }
            }

            // WorkCategories (and cascade to WorkSubCategories and WorkItems)
            if (workCategoryOps?.delete?.length) {
                const idsToDelete = workCategoryOps.delete.map(op => op.id).filter(id => mongoose.Types.ObjectId.isValid(id) && !String(id).startsWith('temp_'));
                if (idsToDelete.length > 0) {
                    // Find subcategories linked to these work categories to cascade delete their work items
                    const subCategoriesToCascade = await WorkSubCategory.find({ workCategory: { $in: idsToDelete } }).select('_id').session(currentSession);
                    const subCategoryIdsToCascade = subCategoriesToCascade.map(sc => sc._id);
                    if (subCategoryIdsToCascade.length > 0) {
                        await WorkItem.deleteMany({ workSubCategory: { $in: subCategoryIdsToCascade } }, { session: currentSession });
                    }
                    await WorkItem.deleteMany({ workCategory: { $in: idsToDelete } }, { session: currentSession }); // Items directly linked
                    await WorkSubCategory.deleteMany({ workCategory: { $in: idsToDelete } }, { session: currentSession }); // SubCategories
                    await WorkCategory.deleteMany({ _id: { $in: idsToDelete } }, { session: currentSession });
                    results.deletedData.workCategoriesIds.push(...idsToDelete);
                }
            }

            // TaskTypes (with cascading)
            if (taskTypeOps?.delete?.length) {
                const idsToDelete = taskTypeOps.delete.map(op => op.id).filter(id => mongoose.Types.ObjectId.isValid(id) && !String(id).startsWith('temp_'));
                if (idsToDelete.length > 0) {
                    const workCategoriesToCascade = await WorkCategory.find({ taskType: { $in: idsToDelete } }).select('_id').session(currentSession);
                    const workCategoryIdsToCascade = workCategoriesToCascade.map(wc => wc._id);
                    if (workCategoryIdsToCascade.length > 0) {
                        const subCategoriesToCascade = await WorkSubCategory.find({ workCategory: { $in: workCategoryIdsToCascade } }).select('_id').session(currentSession);
                        const subCategoryIdsToCascade = subCategoriesToCascade.map(sc => sc._id);
                        if (subCategoryIdsToCascade.length > 0) {
                            await WorkItem.deleteMany({ workSubCategory: { $in: subCategoryIdsToCascade } }, { session: currentSession });
                        }
                        await WorkItem.deleteMany({ workCategory: { $in: workCategoryIdsToCascade } }, { session: currentSession });
                        await WorkSubCategory.deleteMany({ workCategory: { $in: workCategoryIdsToCascade } }, { session: currentSession });
                        await WorkCategory.deleteMany({ _id: { $in: workCategoryIdsToCascade } }, { session: currentSession });
                    }
                    await TaskType.deleteMany({ _id: { $in: idsToDelete } }, { session: currentSession });
                    results.deletedData.taskTypesIds.push(...idsToDelete);
                }
            }


            // --- CREATIONS (Parents first, then children) ---
            // TaskTypes
            if (taskTypeOps?.create?.length) {
                for (const op of taskTypeOps.create) {
                    const { _id: tempFrontendId, ...dataForDb } = op.data;
                    try {
                        const newTaskType = new TaskType(dataForDb);
                        await newTaskType.save({ session: currentSession }); 
                        tempIdToNewIdMap.set(op.tempId, newTaskType._id.toString());
                        results.createdTaskTypes.push({ tempId: op.tempId, newTaskType: newTaskType.toObject() });
                    } catch (err) {
                        results.errors.push({ type: 'CREATE_TASKTYPE_ERROR', tempId: op.tempId, message: err.message, item: op.data });
                    }
                }
            }

            // WorkCategories
            if (workCategoryOps?.create?.length) {
                for (const op of workCategoryOps.create) {
                    const { _id: tempFrontendId, ...dataForDb } = op.data;
                    let finalData = { ...dataForDb };
                    if (finalData.taskType) {
                        if (tempIdToNewIdMap.has(finalData.taskType)) {
                            finalData.taskType = tempIdToNewIdMap.get(finalData.taskType);
                        } else if (!mongoose.Types.ObjectId.isValid(finalData.taskType)) {
                            results.errors.push({ type: 'CREATE_WORKCATEGORY_ERROR', tempId: op.tempId, message: `TaskType ID ${finalData.taskType} is temporary and not resolved, or invalid.`, item: op.data });
                            continue;
                        }
                    } else { // TaskType is required
                        results.errors.push({ type: 'CREATE_WORKCATEGORY_ERROR', tempId: op.tempId, message: `TaskType is required.`, item: op.data });
                        continue;
                    }
                    try {
                        const newWorkCategory = new WorkCategory(finalData);
                        await newWorkCategory.save({ session: currentSession });
                        tempIdToNewIdMap.set(op.tempId, newWorkCategory._id.toString());
                        results.createdWorkCategories.push({ tempId: op.tempId, newWorkCategory: newWorkCategory.toObject() });
                    } catch (err) {
                        results.errors.push({ type: 'CREATE_WORKCATEGORY_ERROR', tempId: op.tempId, message: err.message, item: op.data });
                    }
                }
            }

            // WorkSubCategories
            if (workSubCategoryOps?.create?.length) {
                for (const op of workSubCategoryOps.create) {
                    const { _id: tempFrontendId, ...dataForDb } = op.data;
                    let finalData = { ...dataForDb };
                    if (finalData.workCategory) {
                        if (tempIdToNewIdMap.has(finalData.workCategory)) {
                            finalData.workCategory = tempIdToNewIdMap.get(finalData.workCategory);
                        } else if (!mongoose.Types.ObjectId.isValid(finalData.workCategory)) {
                            results.errors.push({ type: 'CREATE_WORKSUBCATEGORY_ERROR', tempId: op.tempId, message: `WorkCategory ID ${finalData.workCategory} is temporary and not resolved, or invalid.`, item: op.data });
                            continue;
                        }
                    } else { // WorkCategory is required
                         results.errors.push({ type: 'CREATE_WORKSUBCATEGORY_ERROR', tempId: op.tempId, message: `WorkCategory is required.`, item: op.data });
                        continue;
                    }
                    try {
                        const newWorkSubCategory = new WorkSubCategory(finalData);
                        await newWorkSubCategory.save({ session: currentSession });
                        tempIdToNewIdMap.set(op.tempId, newWorkSubCategory._id.toString());
                        results.createdWorkSubCategories.push({ tempId: op.tempId, newWorkSubCategory: newWorkSubCategory.toObject() });
                    } catch (err) {
                        results.errors.push({ type: 'CREATE_WORKSUBCATEGORY_ERROR', tempId: op.tempId, message: err.message, item: op.data });
                    }
                }
            }

            // WorkItems
            if (workItemOps?.create?.length) {
                for (const op of workItemOps.create) {
                    const { _id: tempFrontendId, ...dataForDb } = op.data;
                    let finalData = { ...dataForDb };

                    // Resolve WorkCategory
                    if (finalData.workCategory) {
                        if (tempIdToNewIdMap.has(finalData.workCategory)) {
                            finalData.workCategory = tempIdToNewIdMap.get(finalData.workCategory);
                        } else if (!mongoose.Types.ObjectId.isValid(finalData.workCategory)) {
                            results.errors.push({ type: 'CREATE_WORKITEM_ERROR', tempId: op.tempId, message: `WorkCategory ID ${finalData.workCategory} is temporary and not resolved, or invalid.`, item: op.data });
                            continue;
                        }
                    } else { // WorkCategory is required
                        results.errors.push({ type: 'CREATE_WORKITEM_ERROR', tempId: op.tempId, message: `WorkCategory is required.`, item: op.data });
                        continue;
                    }

                    // Resolve WorkSubCategory
                    if (finalData.workSubCategory && finalData.workSubCategory !== null) {
                        if (tempIdToNewIdMap.has(finalData.workSubCategory)) {
                            finalData.workSubCategory = tempIdToNewIdMap.get(finalData.workSubCategory);
                        } else if (!mongoose.Types.ObjectId.isValid(finalData.workSubCategory)) {
                            results.errors.push({ type: 'CREATE_WORKITEM_ERROR', tempId: op.tempId, message: `WorkSubCategory ID ${finalData.workSubCategory} is temporary and not resolved, or invalid.`, item: op.data });
                            continue;
                        }
                    } else {
                        // If workSubCategory is not provided or explicitly null, ensure it's null
                        finalData.workSubCategory = null;
                    }

                    try {
                        const newWorkItem = new WorkItem(finalData);
                        await newWorkItem.save({ session: currentSession });
                        results.createdWorkItems.push({ tempId: op.tempId, newWorkItem: newWorkItem.toObject() });
                    } catch (err) {
                        results.errors.push({ type: 'CREATE_WORKITEM_ERROR', tempId: op.tempId, message: err.message, item: op.data });
                    }
                }
            }


            // --- UPDATES ---
            const updateConfigs = [
                { ops: taskTypeOps?.update, model: TaskType, name: 'TaskType', resultKey: 'taskTypes' },
                { ops: workCategoryOps?.update, model: WorkCategory, name: 'WorkCategory', resultKey: 'workCategories', parentField: 'taskType' },
                { ops: workSubCategoryOps?.update, model: WorkSubCategory, name: 'WorkSubCategory', resultKey: 'workSubCategories', parentField: 'workCategory' },
                { ops: workItemOps?.update, model: WorkItem, name: 'WorkItem', resultKey: 'workItems', parentField: 'workCategory', secondaryParentField: 'workSubCategory' }
            ];

            for (const config of updateConfigs) {
                if (config.ops?.length) {
                    for (const op of config.ops) {
                        if (!op.id || !mongoose.Types.ObjectId.isValid(op.id) || String(op.id).startsWith('temp_')) {
                            results.errors.push({ type: `UPDATE_${config.name.toUpperCase()}_ERROR`, message: `Cannot update ${config.name} with invalid/temp ID ${op.id}.`, item: op });
                            continue;
                        }
                        const { _id, ...updatePayload } = op.data;

                        if (config.parentField && updatePayload[config.parentField]) {
                            if (tempIdToNewIdMap.has(updatePayload[config.parentField])) {
                                updatePayload[config.parentField] = tempIdToNewIdMap.get(updatePayload[config.parentField]);
                            } else if (!mongoose.Types.ObjectId.isValid(updatePayload[config.parentField])) {
                                results.errors.push({ type: `UPDATE_${config.name.toUpperCase()}_ERROR`, id: op.id, message: `Invalid or unresolved ${config.parentField} ID for update.`, item: op });
                                continue;
                            }
                        }
                        if (config.secondaryParentField && updatePayload[config.secondaryParentField]) {
                             if (updatePayload[config.secondaryParentField] === null) {
                                // This is fine, setting to null
                            } else if (tempIdToNewIdMap.has(updatePayload[config.secondaryParentField])) {
                                updatePayload[config.secondaryParentField] = tempIdToNewIdMap.get(updatePayload[config.secondaryParentField]);
                            } else if (!mongoose.Types.ObjectId.isValid(updatePayload[config.secondaryParentField])) {
                                results.errors.push({ type: `UPDATE_${config.name.toUpperCase()}_ERROR`, id: op.id, message: `Invalid or unresolved ${config.secondaryParentField} ID for update.`, item: op });
                                continue;
                            }
                        }

                        try {
                            const updatedDoc = await config.model.findByIdAndUpdate(op.id, updatePayload, { new: true, runValidators: true, session: currentSession });
                            if (updatedDoc) {
                                results.updatedData[config.resultKey].push(updatedDoc.toObject());
                            } else {
                                results.errors.push({ type: `UPDATE_${config.name.toUpperCase()}_ERROR`, message: `${config.name} with id ${op.id} not found for update.`, item: op });
                            }
                        } catch (err) {
                            results.errors.push({ type: `UPDATE_${config.name.toUpperCase()}_ERROR`, id: op.id, message: err.message, item: op.data });
                        }
                    }
                }
            }
            // --- END UPDATES ---

            if (results.errors.length > 0) {
                console.warn("Bulk operation encountered errors during processing, forcing rollback:", JSON.stringify(results.errors, null, 2));
                throw new Error("Bulk operation failed due to processing errors. Transaction will be rolled back.");
            }
        }); // End of transaction

        res.status(200).json(results);

    } catch (err) {
        console.error("Bulk operation error (transaction likely aborted):", err.message);
        if (!results.errors.some(e => e.type === 'TRANSACTION_ERROR')) {
            results.errors.push({ type: 'TRANSACTION_ERROR', message: err.message });
        }
        res.status(500).json({
            error: "Bulk operation failed. Changes likely rolled back.",
            details: results.errors
        });
    } finally {
        session.endSession();
    }
};