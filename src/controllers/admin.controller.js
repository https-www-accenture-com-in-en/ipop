import MainModel from '../models/master.model.js';

export const createName = async (master_work_types) => {
  const newItem = new MainModel({ master_work_types });
  return await newItem.save();
};

export const editName = async (oldName, newName) => {
   return await MainModel.findOneAndUpdate(
    { master_work_types: oldName },    
    { master_work_types: newName },    
    { new: true }         
  );
};

export const deleteName = async (master_work_types) => {
  return await MainModel.findOneAndDelete({ master_work_types });
};

export const getAllNames = async () => {
  return await MainModel.find();
};

export const addMappedValue = async (master_work_types, work_type_categories) => {
  return await MainModel.findOneAndUpdate(
    { master_work_types },
    { $push: { work_type_categories: work_type_categories } },
    { new: true }
  );
};

/**/
export const editMappedValue = async (name, oldValue, newValue) => {
 return await MainModel.findOneAndUpdate(
    { work_type_categories: oldValue },
    { $set: { 'work_type_categories.$': newValue } },
    { new: true }
 );
};


export const deleteMappedValue = async (master_work_types, name) => {
 
  return await MainModel.findOneAndUpdate(
    { master_work_types:master_work_types },
    { $pull: { work_type_categories: name } },
    { new: true }
  );
};


export const getMappedValues = async (name) => {
  const doc = await MainModel.findOne({ master_work_types: name }, 'work_type_categories');
  return doc ? doc.work_type_categories : [];
};

export const setGuiTypeAndSequence = async (masterType, guiType, sequence) => {
  return await MainModel.findOneAndUpdate(
    { master_work_types: masterType },
    { $set: { gui_type: guiType, sequence: sequence } },
    { new: true }
  );
};