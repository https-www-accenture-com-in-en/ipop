import mongoose from 'mongoose';

const workCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  deliveryWorkTypeCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryWorkTypeCategory',
    required: true,
  },
});

export const WorkCategory = mongoose.model('WorkCategory', workCategorySchema);

const workSubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  workCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkCategory', required: true },
});

export const WorkSubCategory = mongoose.model('WorkSubCategory', workSubCategorySchema);

const workItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkCategory', required: true },
  workSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkSubCategory', default: null },
  clusterValue: {type: mongoose.Schema.Types.ObjectId, ref: 'ClusterValue', default: null},
  active: { type: Boolean, default: true },
  period: { type: String, enum: ['One-Time', 'Daily', 'Weekly', 'FN', 'Monthly'], required: true, default: 'One-Time' },
  isEstimateBasedOnResourceLevel: { type: String, enum: ['Yes', 'No'], required: true, default: 'Yes' },
});

export const WorkItem = mongoose.model('WorkItem', workItemSchema);

const workItemResourceLevelSchema = new mongoose.Schema({
  workItem: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkItem', required: true},
  designation: { type: String, required: true, default: null },
  level: { type: Number, required: true, default: null},
  estimate: { type: Number, required: true },
});

export const WorkItemResourceLevel = mongoose.model('WorkItemResourceLevel', workItemResourceLevelSchema);