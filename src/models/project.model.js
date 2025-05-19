import mongoose from "mongoose";

const clusterSchema = new mongoose.Schema({
  clusterName: {
    type: String,
    required: true,
  },
  clusterValues: {
    type: [String],
  },
});

clusterSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Cluster = mongoose.model("Cluster", clusterSchema);

const masterProjectSchema = new mongoose.Schema({
  masterProjectName: {
    type: String,
    required: true,
  },
  subProjectNames: {
    type: [String],
  },
});

const MasterProject = mongoose.model("MasterProject", masterProjectSchema);

export { Cluster, MasterProject };
