import { MasterProject, SubProject } from "../../models/project.model.js";

// ========== Master Project ==========

// Add Master Project
const addMasterProject = async (req, res) => {
  try {
    const { name } = req.body;
    const master = new MasterProject({ name });
    await master.save();
    res.status(201).json(master);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Master Projects
const getAllMasterProjects = async (req, res) => {
  try {
    const projects = await MasterProject.find().populate("subprojects");
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Master Project by ID
const getMasterProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await MasterProject.findById(id).populate("subprojects");
    if (!project) return res.status(404).json({ message: "Not found" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Master Project
const updateMasterProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await MasterProject.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Master Project and its subprojects
const deleteMasterProject = async (req, res) => {
  try {
    const { id } = req.params;
    const master = await MasterProject.findById(id);
    if (!master) return res.status(404).json({ message: "Not found" });

    await SubProject.deleteMany({ _id: { $in: master.subprojects } });
    await MasterProject.findByIdAndDelete(id);

    res.status(200).json({ message: "Master Project and subprojects deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== Sub Project ==========

// Add SubProject and link to Master
const addSubProject = async (req, res) => {
  try {
    const { name, masterProject } = req.body;

    const sub = new SubProject({ name, masterProject });
    await sub.save();

    await MasterProject.findByIdAndUpdate(masterProject, {
      $push: { subprojects: sub._id },
    });

    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all SubProjects
const getAllSubProjects = async (req, res) => {
  try {
    const subs = await SubProject.find().populate("masterProject");
    res.status(200).json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get SubProject by Master Project ID
const getSubProjectsById = async (req, res) => {
  try {
    const { id } = req.params;
    const subs = await SubProject.find({ masterProject: id }).populate(
      "masterProject"
    );
    if (!subs) return res.status(404).json({ message: "Not found" });
    res.status(200).json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get SubProject by ID
const getSubProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID", id);
    const sub = await SubProject.findById(id).populate("masterProject");
    if (!sub) return res.status(404).json({ message: "Not found" });
    res.status(200).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update SubProject
const updateSubProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const sub = await SubProject.findById(id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    sub.name = name;
    await sub.save();

    res.status(200).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete SubProject
const deleteSubProject = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await SubProject.findById(id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    await MasterProject.findByIdAndUpdate(sub.masterProject, {
      $pull: { subprojects: sub._id },
    });

    await SubProject.findByIdAndDelete(id);

    res.status(200).json({ message: "Subproject deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  getSubProjectsById,
  getSubProjectById,
  updateSubProject,
  deleteSubProject,
};
