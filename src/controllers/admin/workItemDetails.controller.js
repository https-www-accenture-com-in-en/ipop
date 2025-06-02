import mongoose from 'mongoose';
import { WorkItem, WorkItemResourceLevel } from '../../models/non-ticket-delivery-worktype-category.model.js';

export const httpGetWorkItemDetailsById = async (req, res) => {
  const { workItemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workItemId)) {
    return res.status(400).json({ message: 'Invalid WorkItem ID format' });
  }

  try {
    const workItem = await WorkItem.findById(workItemId).lean();

    if (!workItem) {
      return res.status(404).json({ message: 'WorkItem not found' });
    }

    // Fetch associated resource levels
    const resourceLevels = await WorkItemResourceLevel.find({ workItem: workItemId }).lean();

    // Combine and send
    const detailedWorkItem = {
      ...workItem,
      resourceLevels: resourceLevels || [] // Ensure resourceLevels is always an array
    };

    res.status(200).json(detailedWorkItem);
  } catch (error) {
    console.error("Error fetching work item details by ID:", error);
    res.status(500).json({ message: 'Failed to fetch work item details', error: error.message });
  }
};

// --- Update WorkItem Details (Status, Period, Estimates) ---
export const httpUpdateWorkItemDetails = async (req, res) => {
  const { workItemId } = req.params;
  const { active, period, isEstimateBasedOnResourceLevel, resourceLevels } = req.body;

  if (!mongoose.Types.ObjectId.isValid(workItemId)) {
    return res.status(400).json({ message: 'Invalid WorkItem ID format' });
  }

  // Validate period against enum
  const periodEnumValues = WorkItem.schema.path('period').enumValues;
  if (period && !periodEnumValues.includes(period)) {
      return res.status(400).json({ message: `Invalid period value. Allowed values are: ${periodEnumValues.join(', ')}` });
  }

  // Validate isEstimateBasedOnResourceLevel against enum
  const estimateTypeEnumValues = WorkItem.schema.path('isEstimateBasedOnResourceLevel').enumValues;
   if (isEstimateBasedOnResourceLevel && !estimateTypeEnumValues.includes(isEstimateBasedOnResourceLevel)) {
      return res.status(400).json({ message: `Invalid isEstimateBasedOnResourceLevel value. Allowed values are: ${estimateTypeEnumValues.join(', ')}` });
  }

  const session = await mongoose.startSession();
  try {
    let finalWorkItemData;

    await session.withTransaction(async (currentSession) => {
      // 1. Find the WorkItem
      const workItemToUpdate = await WorkItem.findById(workItemId).session(currentSession);
      if (!workItemToUpdate) {
        const err = new Error('WorkItem not found');
        err.statusCode = 404;
        throw err;
      }

      // 2. Update the WorkItem document's fields
      workItemToUpdate.active = active;
      workItemToUpdate.period = period;
      workItemToUpdate.isEstimateBasedOnResourceLevel = isEstimateBasedOnResourceLevel;
      
      await workItemToUpdate.save({ session: currentSession });

      // 3. Delete existing WorkItemResourceLevel entries for this workItem
      await WorkItemResourceLevel.deleteMany({ workItem: workItemId }, { session: currentSession });

      // 4. Create new WorkItemResourceLevel entries if any
      if (resourceLevels && resourceLevels.length > 0) {
        const resourceLevelDocs = resourceLevels.map(rl => {
          if (typeof rl.estimate !== 'number' || isNaN(rl.estimate)) {
            const err = new Error('Invalid estimate value in resource levels. Must be a number.');
            err.statusCode = 400;
            throw err;
          }
          // Ensure designation and level are null if isEstimateBasedOnResourceLevel is 'No'
          let designation = rl.designation;
          let level = rl.level;
          if (isEstimateBasedOnResourceLevel === 'No') {
              designation = null;
              level = null;
          }
          // No specific validation for designation/level if 'Yes', relies on schema defaults for now
          return {
            workItem: workItemId,
            designation: designation,
            level: level,
            estimate: rl.estimate,
          };
        });
        await WorkItemResourceLevel.insertMany(resourceLevelDocs, { session: currentSession });
      }

      const fullyUpdatedWorkItem = await WorkItem.findById(workItemId)
        .session(currentSession)
        .lean();

        if(!fullyUpdatedWorkItem){
             const err = new Error('Failed to retrieve updated WorkItem after transaction.');
             err.statusCode = 500;
             throw err;
        }
        const newResourceLevels = await WorkItemResourceLevel.find({ workItem: workItemId }).session(currentSession).lean();
        finalWorkItemData = { ...fullyUpdatedWorkItem, resourceLevels: newResourceLevels };


    }); // End of transaction

    if (!finalWorkItemData) {
        return res.status(404).json({ message: 'WorkItem details processed, but final data retrieval failed.' });
    }
    res.status(200).json(finalWorkItemData);

  } catch (error) {
    console.error("Error updating work item details:", error.message, error.stack);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || "Failed to update work item details" });
  } finally {
    session.endSession();
  }
};