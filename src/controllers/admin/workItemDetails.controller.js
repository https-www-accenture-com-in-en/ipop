import mongoose from 'mongoose';
import { WorkItem, WorkItemResourceLevel } from '../../models/non-ticket-delivery-worktype-category.model.js';

export const httpGetWorkItemDetailsById = async (req, res) => {
  const { workItemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workItemId)) {
    return res.status(400).json({ message: 'Invalid WorkItem ID format' });
  }

  try {
    const workItem = await WorkItem.findById(workItemId)
      .populate({
        path: 'clusterValue', // Populate the 'clusterValue' field in WorkItem
        populate: {
          path: 'cluster',    // Further populate the 'cluster' field within 'clusterValue'
          model: 'Cluster'    // Explicitly provide model name for clarity/safety
        }
      })
      .lean();

    if (!workItem) {
      return res.status(404).json({ message: 'WorkItem not found' });
    }

    const resourceLevels = await WorkItemResourceLevel.find({ workItem: workItemId }).lean();

    const detailedWorkItem = {
      ...workItem,
      resourceLevels: resourceLevels || [],
    };

    res.status(200).json(detailedWorkItem);
  } catch (error) {
    console.error("Error fetching work item details by ID:", error);
    res.status(500).json({ message: 'Failed to fetch work item details', error: error.message });
  }
};

export const httpUpdateWorkItemDetails = async (req, res) => {
  const { workItemId } = req.params;
  // Add clusterValue to destructuring
  const { active, period, isEstimateBasedOnResourceLevel, resourceLevels, clusterValue } = req.body;

  if (!mongoose.Types.ObjectId.isValid(workItemId)) {
    return res.status(400).json({ message: 'Invalid WorkItem ID format' });
  }

  const periodEnumValues = WorkItem.schema.path('period').enumValues;
  if (period && !periodEnumValues.includes(period)) {
      return res.status(400).json({ message: `Invalid period value. Allowed values are: ${periodEnumValues.join(', ')}` });
  }

  const estimateTypeEnumValues = WorkItem.schema.path('isEstimateBasedOnResourceLevel').enumValues;
  if (isEstimateBasedOnResourceLevel && !estimateTypeEnumValues.includes(isEstimateBasedOnResourceLevel)) {
      return res.status(400).json({ message: `Invalid isEstimateBasedOnResourceLevel value. Allowed values are: ${estimateTypeEnumValues.join(', ')}` });
  }

  // Validate clusterValue if provided (it can be null)
  if (clusterValue !== null && clusterValue !== undefined && !mongoose.Types.ObjectId.isValid(clusterValue)) {
      return res.status(400).json({ message: 'Invalid ClusterValue ID format' });
  }

  const session = await mongoose.startSession();
  try {
    let finalWorkItemData;

    await session.withTransaction(async (currentSession) => {
      const workItemToUpdate = await WorkItem.findById(workItemId).session(currentSession);
      if (!workItemToUpdate) {
        const err = new Error('WorkItem not found');
        err.statusCode = 404;
        throw err;
      }

      workItemToUpdate.active = active;
      workItemToUpdate.period = period;
      workItemToUpdate.isEstimateBasedOnResourceLevel = isEstimateBasedOnResourceLevel;
      // Set clusterValue. If `clusterValue` is not in body, it defaults to current.
      // If `clusterValue` is explicitly `null` in body, it's set to `null`.
      workItemToUpdate.clusterValue = clusterValue === undefined ? workItemToUpdate.clusterValue : (clusterValue || null);
      
      await workItemToUpdate.save({ session: currentSession });

      await WorkItemResourceLevel.deleteMany({ workItem: workItemId }, { session: currentSession });

      if (resourceLevels && resourceLevels.length > 0) {
        const resourceLevelDocs = resourceLevels.map(rl => {
          if (typeof rl.estimate !== 'number' || isNaN(rl.estimate)) {
            const err = new Error('Invalid estimate value in resource levels. Must be a number.');
            err.statusCode = 400;
            throw err;
          }
          let designation = rl.designation;
          let level = rl.level;
          if (isEstimateBasedOnResourceLevel === 'No') {
              designation = null;
              level = null;
          }
          return {
            workItem: workItemId,
            designation: designation,
            level: level,
            estimate: rl.estimate,
          };
        });
        await WorkItemResourceLevel.insertMany(resourceLevelDocs, { session: currentSession });
      }

      // Fetch the fully updated work item with populated clusterValue for the response
      const fullyUpdatedWorkItem = await WorkItem.findById(workItemId)
        .populate({
          path: 'clusterValue',
          populate: {
            path: 'cluster',
            model: 'Cluster'
          }
        })
        .session(currentSession)
        .lean();

        if(!fullyUpdatedWorkItem){
             const err = new Error('Failed to retrieve updated WorkItem after transaction.');
             err.statusCode = 500;
             throw err;
        }
        const newResourceLevels = await WorkItemResourceLevel.find({ workItem: workItemId }).session(currentSession).lean();
        finalWorkItemData = { ...fullyUpdatedWorkItem, resourceLevels: newResourceLevels };
    });

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