import Group from "../../models/admin.model.js";

const httpGetAdminData = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpAddAdminData = async (req, res) => {
  try {
    const { menuItem, groupName, fields, fieldOptions } = req.body;

    if (
      !groupName ||
      !fields ||
      !Array.isArray(fields) ||
      !menuItem ||
      !Array.isArray(menuItem)
    ) {
      return res.status(400).json({ error: "Invalid data" });
    }

    //cleaning the field options sepeated by commas
    if (fieldOptions) {
      const optionsArray = fieldOptions
        .split(",")
        .map((option) => option.trim());
      fields.forEach((field) => {
        if (field.fieldType === "select") {
          field.fieldOptions = optionsArray;
        }
      });
    }

    const newGroup = new Group({ menuItem, groupName, fields });
    await newGroup.save();

    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { httpGetAdminData, httpAddAdminData };
