import mongoose from 'mongoose';
const mainSchema = new mongoose.Schema({
  master_work_types: {
    type: String,
  },
  gui_type: {
    type: String,
  },
  work_type_categories: {
    type: [String],
  },
  sequence: {
    type: Number,
  },
});
// Create the Mongoose model
const MainModel = mongoose.model('MainModel', mainSchema);
export default MainModel;

