import mongoose from "mongoose";
import { Schema } from "mongoose";
const masterWorkTypeSchema = new Schema(
  {
    masterWorkTypes: {
      type: String,
      required: true,
    },
    uiType: {
      type: String,
      // required: true,
    },
    sequence: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

// masterWorkTypeSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

const MasterWorkType = mongoose.model("MasterWorkType", masterWorkTypeSchema);

const deliveryWorkTypeSchema = new Schema(
  {
    deliveryWorkTypes: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      // required: true,
    },
    MasterWorkTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterWorkType",
      required: true,
    },
  },
  { timestamps: true }
);

// deliveryWorkTypeSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

const DeliveryWorkType = mongoose.model(
  "DeliveryWorkType",
  deliveryWorkTypeSchema
);

const uiTypeSchema = new Schema(
  {
    uitype: {
      type: String,
      enum: ["checkbox", "radio", "button"],
      default: "checkbox",
      required: true,
    },
  },
  { timestamps: true }
);

const UIType = mongoose.model("UIType", uiTypeSchema);

export { MasterWorkType, DeliveryWorkType, UIType };
