import mongoose from "mongoose";
const masterWorkTypeSchema = new mongoose.Schema(
  {
    masterWorkTypes: {
      type: String, // or an Array/Object depending on your data
      required: true,
    },
    uiType: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// masterWorkTypeSchema.virtual("deliveryWorkTypes", {
//   ref: "DeliveryWorkType",
//   localField: "_id",
//   foreignField: "MasterWorkTypeId",
//   justOne: false,
// });

// masterWorkTypeSchema.set("toObject", { virtuals: true });
// masterWorkTypeSchema.set("toJSON", { virtuals: true });

masterWorkTypeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const MasterWorkType = mongoose.model("MasterWorkType", masterWorkTypeSchema);

const DeliveryWorkTypeSchema = new mongoose.Schema(
  {
    masterWorkTypes: {
      type: String, // same as in the first model
      required: true,
    },
    deliveryWorkTypes: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    MasterWorkTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterWorkType",
      required: true,
    },
  },
  { timestamps: true }
);

DeliveryWorkTypeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const DeliveryWorkType = mongoose.model(
  "DeliveryWorkType",
  DeliveryWorkTypeSchema
);

export { MasterWorkType, DeliveryWorkType };
