import {MasterWorkType, DeliveryWorkType} from "../models/admin.model.js";

const httpGetAdminData = async (req, res) => {
  try {
    const masterWorkType = await MasterWorkType.find();
    res.status(200).json(masterWorkType);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpCreateMasterDataL1 = async (req, res) => {
  console.log(req.body);
  try {
    const workTypes = req.body;
    
    // Insert all documents
    const saved = await MasterWorkType.insertMany(workTypes);
    return res
      .status(201)
      .json({ message: "Master work types saved successfully", data: saved });
  } catch (err) {
    console.error("Error saving master work types:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const httpcreateDeliveryDataL2 = async (req, res) => {
  console.log(req.body);
  try {
    const workTypes = req.body;
    
    // Insert all documents
    const saved = await DeliveryWorkType.insertMany(workTypes);
    return res
      .status(201)
      .json({ message: "Delivery work types saved successfully", data: saved });
  } catch (err) {
    console.error("Error saving delivery work types:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}


export { httpGetAdminData, httpCreateMasterDataL1, httpcreateDeliveryDataL2 };
