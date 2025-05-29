import mongoose from 'mongoose';
import { WorkCategory, WorkSubCategory, WorkItem } from '../../models/non-ticket-delivery-worktype-category.model.js'; // Adjust path as needed


export const httpGetWorkCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.deliveryWorkTypeCategoryId && mongoose.Types.ObjectId.isValid(req.query.deliveryWorkTypeCategoryId)) {
      filter.deliveryWorkTypeCategory = req.query.deliveryWorkTypeCategoryId;
    }
    const workCategories = await WorkCategory.find(filter).populate('deliveryWorkTypeCategory');
    res.status(200).json(workCategories);
  } catch (err)
  {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetWorkCategoryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid WorkCategory ID format' });
    }
    const workCategory = await WorkCategory.findById(req.params.id).populate('deliveryWorkTypeCategory');
    if (!workCategory) {
      return res.status(404).json({ message: 'WorkCategory not found' });
    }
    res.status(200).json(workCategory);
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
    // Updated populate path
    const workSubCategories = await WorkSubCategory.find(filter).populate({
        path: 'workCategory',
        populate: { path: 'deliveryWorkTypeCategory' }
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
    // Updated populate path
    const workSubCategory = await WorkSubCategory.findById(req.params.id).populate({
        path: 'workCategory',
        populate: { path: 'deliveryWorkTypeCategory' }
    });
    if (!workSubCategory) {
      return res.status(404).json({ message: 'WorkSubCategory not found' });
    }
    res.status(200).json(workSubCategory);
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
      .populate({ path: 'workCategory', populate: { path: 'deliveryWorkTypeCategory' } })
      .populate({ path: 'workSubCategory', populate: { path: 'workCategory', populate: { path: 'deliveryWorkTypeCategory' } } });
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
      .populate({ path: 'workCategory', populate: { path: 'deliveryWorkTypeCategory' } })
      .populate({ path: 'workSubCategory', populate: { path: 'workCategory', populate: { path: 'deliveryWorkTypeCategory' } } });
    if (!workItem) {
      return res.status(404).json({ message: 'WorkItem not found' });
    }
    res.status(200).json(workItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpBulkWorkOperations = async (req, res) => {
    // Destructure the payload
    const {
        workCategories: workCategoryOps,
        workSubCategories: workSubCategoryOps,
        workItems: workItemOps
    } = req.body;

    const results = {
        createdWorkCategories: [],
        createdWorkSubCategories: [],
        createdWorkItems: [],
        updatedData: {
            workCategories: [],
            workSubCategories: [],
            workItems: [],
        },
        deletedData: {
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
                    const subCategoriesToCascade = await WorkSubCategory.find({ workCategory: { $in: idsToDelete } }).select('_id').session(currentSession);
                    const subCategoryIdsToCascade = subCategoriesToCascade.map(sc => sc._id);
                    if (subCategoryIdsToCascade.length > 0) {
                        await WorkItem.deleteMany({ workSubCategory: { $in: subCategoryIdsToCascade } }, { session: currentSession });
                    }
                    await WorkItem.deleteMany({ workCategory: { $in: idsToDelete } }, { session: currentSession }); 
                    await WorkSubCategory.deleteMany({ workCategory: { $in: idsToDelete } }, { session: currentSession }); 
                    await WorkCategory.deleteMany({ _id: { $in: idsToDelete } }, { session: currentSession });
                    results.deletedData.workCategoriesIds.push(...idsToDelete);
                }
            }

            // --- CREATIONS (Parents first, then children) ---

            // WorkCategories
            if (workCategoryOps?.create?.length) {
                for (const op of workCategoryOps.create) {
                    const { _id: tempFrontendId, ...dataForDb } = op.data;
                    let finalData = { ...dataForDb };
                    if (finalData.deliveryWorkTypeCategory) {
                        if (!mongoose.Types.ObjectId.isValid(finalData.deliveryWorkTypeCategory)) {
                            results.errors.push({ type: 'CREATE_WORKCATEGORY_ERROR', tempId: op.tempId, message: `DeliveryWorkTypeCategory ID ${finalData.deliveryWorkTypeCategory} is invalid.`, item: op.data });
                            continue;
                        }
                    } else {
                        results.errors.push({ type: 'CREATE_WORKCATEGORY_ERROR', tempId: op.tempId, message: `DeliveryWorkTypeCategory is required.`, item: op.data });
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
                    } else { 
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

                    if (finalData.workCategory) {
                        if (tempIdToNewIdMap.has(finalData.workCategory)) {
                            finalData.workCategory = tempIdToNewIdMap.get(finalData.workCategory);
                        } else if (!mongoose.Types.ObjectId.isValid(finalData.workCategory)) {
                            results.errors.push({ type: 'CREATE_WORKITEM_ERROR', tempId: op.tempId, message: `WorkCategory ID ${finalData.workCategory} is temporary and not resolved, or invalid.`, item: op.data });
                            continue;
                        }
                    } else { 
                        results.errors.push({ type: 'CREATE_WORKITEM_ERROR', tempId: op.tempId, message: `WorkCategory is required.`, item: op.data });
                        continue;
                    }

                    if (finalData.workSubCategory && finalData.workSubCategory !== null) {
                        if (tempIdToNewIdMap.has(finalData.workSubCategory)) {
                            finalData.workSubCategory = tempIdToNewIdMap.get(finalData.workSubCategory);
                        } else if (!mongoose.Types.ObjectId.isValid(finalData.workSubCategory)) {
                            results.errors.push({ type: 'CREATE_WORKITEM_ERROR', tempId: op.tempId, message: `WorkSubCategory ID ${finalData.workSubCategory} is temporary and not resolved, or invalid.`, item: op.data });
                            continue;
                        }
                    } else {
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
                { ops: workCategoryOps?.update, model: WorkCategory, name: 'WorkCategory', resultKey: 'workCategories', parentField: 'deliveryWorkTypeCategory' }, // parentField updated
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
                                const parentFieldName = config.parentField === 'deliveryWorkTypeCategory' ? 'DeliveryWorkTypeCategory' : config.parentField;
                                results.errors.push({ type: `UPDATE_${config.name.toUpperCase()}_ERROR`, id: op.id, message: `Invalid or unresolved ${parentFieldName} ID for update.`, item: op });
                                continue;
                            }
                        }
                        if (config.secondaryParentField && updatePayload[config.secondaryParentField]) {
                             if (updatePayload[config.secondaryParentField] === null) {
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
        const responseErrors = results.errors.length > 0 ? results.errors : [{ type: 'TRANSACTION_ERROR', message: err.message }];
        res.status(500).json({
            error: "Bulk operation failed. Changes likely rolled back.",
            details: responseErrors
        });
    } finally {
        session.endSession();
    }
};