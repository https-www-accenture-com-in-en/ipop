import mongoose from "mongoose";

const deliveryWorkTypeCategorySchema = new mongoose.Schema(
  {
    deliveryWorkTypes: {
      type: String,
      required: true,
    },
    workTypeCategory: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    deliveryWorkTypesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryWorkType",
      required: true,
    },
  },
  { timestamps: true }
);

deliveryWorkTypeCategorySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const DeliveryWorkTypeCategory = mongoose.model(
  "DeliveryWorkTypeCategory",
  deliveryWorkTypeCategorySchema
);

export { DeliveryWorkTypeCategory };
