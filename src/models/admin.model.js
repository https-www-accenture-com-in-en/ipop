import mongoose from "mongoose";
const { Schema } = mongoose;

const workTypeSchema = new Schema({
    screenFieldName: { type: String, required: true },
    screenFieldtype: { type: String, required: true },
    screenFieldSequence: { type: Number, required: true }
});

const WorkType = mongoose.model('WorkType', workTypeSchema);

const deliveryWorkTypeSchema = new Schema({
    masterWorkType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterWorkType',
        required: true
    }, // Reference to the MasterWorkType schema
    deliveryWorkTypes: { type: String, required: true },
    workTypesCategories: { type: String, required: true },
    workTypes: [workTypeSchema] // Embedding the WorkType schema here
});


const DeliveryWorkType = mongoose.models.DeliveryWorkType || mongoose.model('DeliveryWorkType', deliveryWorkTypeSchema);

const masterWorkTypeSchema = new Schema({
    fieldName: { type: String, required: true },
    fieldType: { type: String, required: true },
    sequence: { type: Number, required: true },
    deliveryWorkType: [deliveryWorkTypeSchema] // Embedding the DeliveryWorkType schema here
});


const MasterWorkType = mongoose.models.MasterWorkType || mongoose.model('MasterWorkType', masterWorkTypeSchema);

const timeOffCategorySchema = new Schema({
    name: {
    type: String,
    required: true,
    unique: true,
  }
});

const TimeOffCategory = mongoose.model("TimeOffCategory", timeOffCategorySchema);

export {MasterWorkType, DeliveryWorkType, WorkType, TimeOffCategory};

