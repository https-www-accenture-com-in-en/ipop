import mongoose from "mongoose";
const { Schema } = mongoose;

const ClusterSchema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Cluster = mongoose.model('Cluster', ClusterSchema);
 

const ClusterValueSchema = new Schema({
  name: { type: String, required: true },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', required: true },
}, { timestamps: true });

const ClusterValue = mongoose.model('ClusterValue', ClusterValueSchema);


const TaskSchema = new Schema({
  label: { type: String, required: true },
  effortPercentage: { type: Number, required: true },
  estimatedEffort: { type: Number, required: true },
  burntEffort: { type: Number, default: 0 },
}, { _id: false });

const ADProjectSchema = new Schema({
  name: { type: String, required: true },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', required: true },
  clusterValue: { type: mongoose.Schema.Types.ObjectId, ref: 'ClusterValue', required: true },
  estimationPersonDays: { type: Number, required: true },
  etlPersonDays: { type: Number, required: true },
  vModelTasks: [TaskSchema],
  etlTasks: [TaskSchema],
}, { timestamps: true });

const ADProject = mongoose.model('ADProject', ADProjectSchema);

export {ADProject, ClusterValue, Cluster};
