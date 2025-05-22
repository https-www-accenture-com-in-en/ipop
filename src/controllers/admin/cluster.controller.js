import {Cluster, ClusterValue, ADProject} from '../../models/cluster.model.js';

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