import { UIType } from "../models/master.model.js";

async function seedDefaultUIType() {
  const count = await UIType.countDocuments();
  if (count === 0) {
    await UIType.create({ uitype: "checkbox" });
    console.log("Default UIType created.");
  } else {
    console.log("UIType already seeded.");
  }
}

export default seedDefaultUIType;
