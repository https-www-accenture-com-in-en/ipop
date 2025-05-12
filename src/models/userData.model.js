import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    fieldName: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const userDataSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    entries: [entrySchema],
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", userDataSchema);
export default UserData;
