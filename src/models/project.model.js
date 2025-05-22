import mongoose from "mongoose";

const masterProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subprojects: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubProject" }],
  },
  { timestamps: true }
);

const MasterProject = mongoose.model("MasterProject", masterProjectSchema);

const subProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    masterProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterProject",
      required: true,
    },
  },
  { timestamps: true }
);

const SubProject = mongoose.model("SubProject", subProjectSchema);

export { MasterProject, SubProject };
