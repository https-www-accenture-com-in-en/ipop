import mongoose from 'mongoose';

const taskTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const TaskType = mongoose.model('TaskType', taskTypeSchema);

const workCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  taskType: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskType', required: true },
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
});

export const WorkItem = mongoose.model('WorkItem', workItemSchema);