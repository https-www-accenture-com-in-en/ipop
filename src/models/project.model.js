import mongoose from "mongoose";

const masterProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const MasterProject = mongoose.model("MasterProject", masterProjectSchema);

const taskEffortSchema = new mongoose.Schema(
  {
    projectTask: { type: String, required: true },
    distribution: { type: Number, required: true, default: 0 },
    estimatedEffort: { type: Number, required: true, default: 0 },
    burntEffort: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const subProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    masterProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterProject",
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

const SubProject = mongoose.model("SubProject", subProjectSchema);

export { MasterProject, SubProject };
