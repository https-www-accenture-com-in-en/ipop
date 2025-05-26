import {Cluster, ClusterValue, ADProject} from '../../models/cluster.model.js';
import mongoose from 'mongoose';

export const httpAddCluster = async (req, res) => {
  try {
    const cluster = await Cluster.create(req.body);
    res.status(201).json(cluster);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetCluster = async (req, res) => {
  try {
    const clusters = await Cluster.find();
    res.status(200).json(clusters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpUpdateCluster = async (req, res) => {
  try {
    const updated = await Cluster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpDeleteCluster = async (req, res) => {
  try {
    await Cluster.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpAddClusterValue = async (req, res) => {
  try {
    const clusterValue = await ClusterValue.create(req.body);
    res.status(201).json(clusterValue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpGetClusterValues = async (req, res) => {
  try {
    const clusterValues = await ClusterValue.find({ cluster: req.params.clusterId });
    res.status(200).json(clusterValues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpUpdateClusterValue = async (req, res) => {
  try {
    const updated = await ClusterValue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpDeleteClusterValue = async (req, res) => {
  try {
    await ClusterValue.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpAddADProject = async (req, res) => {
  try {
    const project = await ADProject.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const httpBulkClusterOperations = async (req, res) => {
  const { clusters: clusterOps, clusterValues: cvOps } = req.body;
  const results = {
    createdClusters: [],
    createdClusterValues: [],
    updatedData: { clusters: [], clusterValues: [] },
    deletedData: { clusterIds: [], clusterValueIds: [] },
    errors: []
  };
  const tempIdToNewIdMap = new Map();
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      if (cvOps.delete && cvOps.delete.length > 0) {
        const idsToDelete = cvOps.delete.map(op => op.id).filter(id => mongoose.Types.ObjectId.isValid(id));
        if (idsToDelete.length > 0) {
          await ClusterValue.deleteMany({ _id: { $in: idsToDelete } }, { session });
          results.deletedData.clusterValueIds.push(...idsToDelete);
        }
      }
      if (clusterOps.delete && clusterOps.delete.length > 0) {
        const idsToDelete = clusterOps.delete.map(op => op.id).filter(id => mongoose.Types.ObjectId.isValid(id));
        if (idsToDelete.length > 0) {
          await ClusterValue.deleteMany({ cluster: { $in: idsToDelete } }, { session });
          await Cluster.deleteMany({ _id: { $in: idsToDelete } }, { session });
          results.deletedData.clusterIds.push(...idsToDelete);
        }
      }

      // 2. Creations (Clusters first, then ClusterValues to resolve FKs)
      if (clusterOps.create && clusterOps.create.length > 0) {
        for (const op of clusterOps.create) {
          const { _id: tempFrontendId, ...clusterDataForDb } = op.data;
          const newCluster = new Cluster(clusterDataForDb); // Pass data without _id
          await newCluster.save({ session });
          tempIdToNewIdMap.set(op.tempId, newCluster._id.toString());
          results.createdClusters.push({ tempId: op.tempId, newCluster: newCluster.toObject() });
        }
      }

      if (cvOps.create && cvOps.create.length > 0) {
        for (const op of cvOps.create) {
          const { _id: tempFrontendId, ...cvDataForDb } = op.data;
          let clusterFk = cvDataForDb.cluster;

          if (clusterFk && tempIdToNewIdMap.has(clusterFk)) {
            cvDataForDb.cluster = tempIdToNewIdMap.get(clusterFk);
          } else if (clusterFk && String(clusterFk).startsWith('temp_')) {
            results.errors.push({ type: 'CREATE_CV_ERROR', message: `ClusterValue creation error: Temp cluster ID ${clusterFk} not resolved.`, item: op });
            continue;
          }

          if (!cvDataForDb.cluster || !mongoose.Types.ObjectId.isValid(cvDataForDb.cluster)) {
            results.errors.push({ type: 'CREATE_CV_ERROR', message: `ClusterValue creation error: Invalid or missing cluster ID for ${cvDataForDb.name}. Cluster ID was: ${cvDataForDb.cluster}`, item: op });
            continue;
          }
          
          const newClusterValue = new ClusterValue(cvDataForDb); // Pass data without _id
          await newClusterValue.save({ session });
          results.createdClusterValues.push({ tempId: op.tempId, newClusterValue: newClusterValue.toObject() });
        }
      }

      // 3. Updates
      if (clusterOps.update && clusterOps.update.length > 0) {
        for (const op of clusterOps.update) {
          if (op.id && mongoose.Types.ObjectId.isValid(op.id)) {
            const { _id, ...updatePayload } = op.data;
            const updatedCluster = await Cluster.findByIdAndUpdate(op.id, updatePayload, { new: true, runValidators: true, session });
            if (updatedCluster) results.updatedData.clusters.push(updatedCluster.toObject());
            else results.errors.push({type: 'UPDATE_CLUSTER_ERROR', message: `Cluster with id ${op.id} not found for update.` , item: op});
          } else if (op.id && op.id.startsWith('temp_')) {
             results.errors.push({type: 'UPDATE_CLUSTER_ERROR', message: `Cannot update cluster with temporary ID ${op.id}. It should have been created.`, item: op});
          }
        }
      }
      if (cvOps.update && cvOps.update.length > 0) {
        for (const op of cvOps.update) {
          if (op.id && mongoose.Types.ObjectId.isValid(op.id)) {
            let { _id, cluster: clusterFk, ...updatePayload } = op.data;
            
            if (clusterFk && tempIdToNewIdMap.has(clusterFk)) {
              updatePayload.cluster = tempIdToNewIdMap.get(clusterFk);
            } else if (clusterFk && String(clusterFk).startsWith('temp_')) {
              results.errors.push({ type: 'UPDATE_CV_ERROR', message: `ClusterValue update error: Temp cluster ID ${clusterFk} not resolved.`, item: op });
              continue;
            } else if (clusterFk && !mongoose.Types.ObjectId.isValid(clusterFk)) {
              results.errors.push({ type: 'UPDATE_CV_ERROR', message: `ClusterValue update error: Invalid cluster ID ${clusterFk}.`, item: op });
              continue;
            } else {
              if(clusterFk) updatePayload.cluster = clusterFk;
            }

            const updatedCv = await ClusterValue.findByIdAndUpdate(op.id, updatePayload, { new: true, runValidators: true, session });
            if (updatedCv) results.updatedData.clusterValues.push(updatedCv.toObject());
            else results.errors.push({type: 'UPDATE_CV_ERROR', message: `ClusterValue with id ${op.id} not found for update.`, item: op});
          } else if (op.id && op.id.startsWith('temp_')) {
             results.errors.push({type: 'UPDATE_CV_ERROR', message: `Cannot update ClusterValue with temporary ID ${op.id}. It should have been created.`, item: op});
          }
        }
      }
    });

    if (results.errors.length > 0) {
        console.warn("Bulk operation completed with errors:", results.errors);
        res.status(400).json({ message: "Bulk operation completed with errors.", details: results });
        return;
    }
    res.status(200).json(results);

  } catch (err) {
    console.error("Bulk operation error (transaction aborted):", err);
    results.errors.push({ type: 'TRANSACTION_ERROR', message: err.message, stack: err.stack });
    res.status(500).json({ error: "Bulk operation failed. Changes rolled back.", details: results.errors });
  } finally {
    session.endSession();
  }
};

export const httpGetADProject = async (req, res) => {
  try {
    const projects = await ADProject.find().populate('cluster clusterValue');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpUpdateADProject = async (req, res) => {
  try {
    const updated = await ADProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const httpDeleteADProject = async (req, res) => {
  try {
    await ADProject.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};