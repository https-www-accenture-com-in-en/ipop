import express from "express";
import {
  httpGetMasterWT,
  httpGetDeliveryWT,
  httpCreateMasterDeliveryWT,
} from "../controllers/admin/master-delivery.controller.js";
import {
  httpGetTaskTypes,
  httpCreateDeliveryWorkTypeCategory,
} from "../controllers/admin/delivery-worktype-category.controller.js";

import {
  httpAddMetadata,
  httpGetMetadata,
} from "../controllers/admin/metadata.controller.js";
import {
  httpGetTimeOffCategories,
  httpAddTimeOffCategory,
  httpUpdateTimeOffCategory,
  httpDeleteTimeOffCategory,
} from "../controllers/admin/timeoff.controller.js";
import {
  addMasterProject,
  addSubProject,
  deleteMasterProject,
  deleteSubProject,
  getAllMasterProjects,
  getAllSubProjects,
  getMasterProjectById,
  getSubProjectById,
  updateMasterProject,
  updateSubProject,
} from "../controllers/admin/project.controller.js";

const adminRouter = express.Router();

//SCREEN1 MASTER DELIVERY WORK TYPE
adminRouter.get("/master-work-types", httpGetMasterWT);
adminRouter.get("/delivery-work-types", httpGetDeliveryWT);
adminRouter.post("/master-and-delivery-work-types", httpCreateMasterDeliveryWT);

//SCREEN 2 DELIVERY WORK TYPE CATEGORY
adminRouter.get("/tasktypes", httpGetTaskTypes);
adminRouter.post(
  "/delivery-work-type-category",
  httpCreateDeliveryWorkTypeCategory
);

//SCREEN 4
adminRouter.post("/ticket-metadata", httpAddMetadata);
adminRouter.get("/ticket-metadata", httpGetMetadata);

//Master Project
adminRouter.post("/master-projects", addMasterProject);
adminRouter.get("/master-projects", getAllMasterProjects);
adminRouter.get("/master-projects/:id", getMasterProjectById);
adminRouter.put("/master-projects/:id", updateMasterProject);
adminRouter.delete("/master-projects/:id", deleteMasterProject);

// SubProject Routes
adminRouter.post("/sub-projects", addSubProject);
adminRouter.get("/sub-projects", getAllSubProjects);
adminRouter.get("/sub-projects/:id", getSubProjectById);
adminRouter.put("/sub-projects/:id", updateSubProject);
adminRouter.delete("/sub-projects/:id", deleteSubProject);

adminRouter.get("/timeoff", httpGetTimeOffCategories);
adminRouter.post("/timeoff", httpAddTimeOffCategory);
adminRouter.put("/timeoff/:id", httpUpdateTimeOffCategory);
adminRouter.delete("/timeoff/:id", httpDeleteTimeOffCategory);

export default adminRouter;
