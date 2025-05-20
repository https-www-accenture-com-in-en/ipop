import { MasterDeliveryWT } from "../../models/master.model.js";

const httpMasterDeliveryWT = async (req, res) => {
  try {
    const master = await MasterDeliveryWT.find({});
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpCreateMasterDeliveryWT = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { masterWorkTypes, gui_type, deliveryWorkTypes, sequence } = req.body;

    if (!masterWorkTypes || !gui_type || !deliveryWorkTypes || !sequence) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const newMasterDeliveryWT = new MasterDeliveryWT({
      masterWorkTypes,
      gui_type,
      deliveryWorkTypes,
      sequence,
    });

    const savedMasterDeliveryWT = await newMasterDeliveryWT.save();
    if (!savedMasterDeliveryWT) {
      return res
        .status(500)
        .json({ error: "Failed to save master delivery work type" });
    }

    res.status(201).json({
      message: "Master Delivery Work Type created successfully",
      masterDeliveryWT: savedMasterDeliveryWT,
    });
  } catch (error) {
    console.error("Error creating master delivery work type:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { httpMasterDeliveryWT, httpCreateMasterDeliveryWT };
