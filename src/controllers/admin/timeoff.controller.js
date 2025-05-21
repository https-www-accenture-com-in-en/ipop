import {TimeOffCategory} from "../../models/admin.model.js";

const httpGetTimeOffCategories = async (req, res) => {
  try {
    const categories = await TimeOffCategory.find().sort("name");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching time-off categories:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpAddTimeOffCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existing = await TimeOffCategory.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new TimeOffCategory({ name });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating time-off category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpUpdateTimeOffCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updated = await TimeOffCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating time-off category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const httpDeleteTimeOffCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TimeOffCategory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting time-off category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  httpGetTimeOffCategories,
  httpAddTimeOffCategory,
  httpUpdateTimeOffCategory,
  httpDeleteTimeOffCategory,
};
