import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
  {
    fieldName: { type: String, required: true },
    fieldType: { type: String, required: true }, // e.g., 'text', 'dropdown', etc.
    fieldOptions: { type: [String], default: [] }, // Comma-separated values for dropdown options
  },
  { _id: false }
);

const GroupSchema = new mongoose.Schema(
  {
    menuItem: [FieldSchema],
    groupName: { type: String, required: true },
    fields: [FieldSchema],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;
