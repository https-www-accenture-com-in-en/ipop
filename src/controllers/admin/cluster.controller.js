import { Cluster, MasterProject } from "../../models/project.model.js";

const httpAddCluster = async (req, res) => {
  try {
    const { clusterName, clusterValues } = req.body;

    if (!clusterName || !clusterValues || !Array.isArray(clusterValues)) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const newCluster = new Cluster({ clusterName, clusterValues });
    const savedCluster = await newCluster.save();
    if (!savedCluster) {
      return res.status(500).json({ error: "Failed to save cluster" });
    }
    res
      .status(201)
      .json({ message: "Cluster created successfully", cluster: savedCluster });
  } catch (error) {
    console.error("Error creating cluster:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpAddMasterProject = async (req, res) => {
  try {
    const { masterProjectName, projectName } = req.body;

    if (!masterProjectName || !projectName || !Array.isArray(projectName)) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const newMasterProject = new MasterProject({
      masterProjectName,
      projectName,
    });
    const savedMasterProject = await newMasterProject.save();
    if (!savedMasterProject) {
      return res.status(500).json({ error: "Failed to save master project" });
    }
    res
      .status(201)
      .json({
        message: "Master Project created successfully",
        master: savedMasterProject,
      });
  } catch (error) {
    console.error("Error creating master project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpGetCluster = async (req, res) => {
  try {
    const clusters = await Cluster.find();
    res.status(200).json(clusters);
  } catch (error) {
    console.error("Error fetching clusters:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpGetMasterProject = async (req, res) => {
  try {
    const masterProjects = await MasterProject.find();
    res.status(200).json(masterProjects);
  } catch (error) {
    console.error("Error fetching master projects:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  httpAddCluster,
  httpAddMasterProject,
  httpGetCluster,
  httpGetMasterProject,
};
