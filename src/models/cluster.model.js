import mongoose from "mongoose";
const { Schema } = mongoose;

const ClusterSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Cluster = mongoose.model("Cluster", ClusterSchema);

const ClusterValueSchema = new Schema(
  {
    name: { type: String, required: true },
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cluster",
      required: true,
    },
  },
  { timestamps: true }
);

const ClusterValue = mongoose.model("ClusterValue", ClusterValueSchema);

const taskEffortSchema = new mongoose.Schema(
  {
    projectTask: { type: String, required: true },
    distribution: { type: Number, required: true, default: 0 },
    estimatedEffort: { type: Number, required: true, default: 0 },
    burntEffort: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ADProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    clusterValue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClusterValue",
      required: true,
    },
    estimationPersonDays: {
      type: Number,
      required: true,
      default: 0,
    },
    etlPersonDays: {
      type: Number,
      required: true,
      default: 0,
    },
    estimationEffortTable: {
      type: [taskEffortSchema],
      default: [
        {
          projectTask: "Analysis and Design",
          distribution: 15,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Build and UnitTesting",
          distribution: 42,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Integration Testing",
          distribution: 10,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "User Acceptance Testing",
          distribution: 10,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Cut Over",
          distribution: 5,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Go Live Support",
          distribution: 5,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Transport Management",
          distribution: 5,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "NRT",
          distribution: 3,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "PMO Efforts",
          distribution: 5,
          estimatedEffort: 0,
          burntEffort: 0,
        },
      ],
    },
    etlEffortTable: {
      type: [taskEffortSchema],
      default: [
        {
          projectTask: "Data Load",
          distribution: 35,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Data Extraction",
          distribution: 30,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Data Transformation",
          distribution: 15,
          estimatedEffort: 0,
          burntEffort: 0,
        },
        {
          projectTask: "Dry Run",
          distribution: 20,
          estimatedEffort: 0,
          burntEffort: 0,
        },
      ],
    },
  },
  { timestamps: true }
);

const ADProject = mongoose.model("ADProject", ADProjectSchema);

export { ADProject, ClusterValue, Cluster };
