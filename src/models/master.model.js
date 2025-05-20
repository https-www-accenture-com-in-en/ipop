import mongoose from "mongoose";
const masterDeliveryWorkTypes = new mongoose.Schema({
  masterWorkTypes: {
    type: String,
    required: true,
  },
  gui_type: {
    type: String,
    required: true,
  },
  deliveryWorkTypes: {
    type: [String],
  },
  sequence: {
    type: Number,
    required: true,
  },
});

masterDeliveryWorkTypes.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Create the Mongoose model
const MasterDeliveryWT = mongoose.model(
  "MasterDeliveryWT",
  masterDeliveryWorkTypes
);
export { MasterDeliveryWT };
