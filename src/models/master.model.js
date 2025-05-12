const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for WorkTypes
const workTypeSchema = new Schema({
  fieldName: { type: String, required: true },
  fieldType: { type: String, required: true },
  flag: { type: Boolean, required: true }
});

// Define schema for DeliveryWorkTypes
const deliveryWorkTypeSchema = new Schema({
  fieldName: { type: String, required: true },
  fieldType: { type: String, required: true },
  workTypes: [workTypeSchema] // Array of workType objects
});

// Define schema for MasterWorkTypes
const masterWorkTypeSchema = new Schema({
  fieldName: { type: String, required: true },
  fieldType: { type: String, required: true },
  deliveryWorkTypes: [deliveryWorkTypeSchema] // Array of deliveryWorkType objects
});

// Define schema for the main structure
const mainSchema = new Schema({
  masterWorkTypes: [masterWorkTypeSchema] // Array of masterWorkType objects
});

// Create the Mongoose model
const MainModel = mongoose.model('MainModel', mainSchema);

module.exports = MainModel;
