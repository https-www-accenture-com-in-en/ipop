import express from "express";
import {
  httpGetMasterWT,
  httpGetDeliveryWT,
  httpGetMasterWithDeliveryWorkTypes,
  httpCreateMasterDeliveryWT,
  httpEditWorkTypes,
} from "../controllers/admin/master-delivery.controller.js";
import {
  httpGetTaskTypes,
  httpGetAllWorkTypes,
  httpCreateDeliveryWorkTypeCategory,
  httpEditTaskTypes,
} from "../controllers/admin/delivery-worktype-category.controller.js";

import {
  httpCreateTicketType,
  httpGetTicketTypes,
} from "../controllers/admin/ticket-type.controller.js";

import {
  httpAddMetadata,
  httpGetMetadata,
  httpBulkUpsertMetadata,
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
  getSubProjectsById,
  httpBulkProjectOperations,
  updateMasterProject,
  updateSubProject,
} from "../controllers/admin/project.controller.js";
import {
  httpAddCluster,
  httpGetCluster,
  httpUpdateCluster,
  httpDeleteCluster,
  httpAddClusterValue,
  httpGetClusterValues,
  httpUpdateClusterValue,
  httpDeleteClusterValue,
  httpBulkClusterOperations,
  httpAddADProject,
  httpGetADProject,
  httpUpdateADProject,
  httpDeleteADProject,
} from "../controllers/admin/cluster.controller.js";

import * as workController from "../controllers/admin/non-ticket-delivery-worktype-category.controller.js";

const adminRouter = express.Router();

//SCREEN1 MASTER DELIVERY WORK TYPE
adminRouter.get("/master-work-types", httpGetMasterWT);
adminRouter.get("/delivery-work-types", httpGetDeliveryWT);
adminRouter.get(
  "/master-work-types-with-delivery",
  httpGetMasterWithDeliveryWorkTypes
);
adminRouter.post("/master-and-delivery-work-types", httpCreateMasterDeliveryWT);
adminRouter.patch("/work-types/bulk-edit", httpEditWorkTypes);

//SCREEN 2 DELIVERY WORK TYPE CATEGORY
adminRouter.get("/only-task-types", httpGetTaskTypes);
adminRouter.get("/task-types-with-mwt-dwt", httpGetAllWorkTypes);
adminRouter.post(
  "/delivery-work-type-category",
  httpCreateDeliveryWorkTypeCategory
);
adminRouter.patch("/task-types/bulk-edit", httpEditTaskTypes);

//SCREEN 3
adminRouter.post("/ticket-types", httpCreateTicketType);
adminRouter.get("/ticket-types", httpGetTicketTypes); // This should be renamed to httpGetTicketTypes

//SCREEN 4
adminRouter.post("/ticket-metadata", httpAddMetadata);
adminRouter.get("/ticket-metadata", httpGetMetadata);
adminRouter.post("/ticket-metadata/bulk", httpBulkUpsertMetadata);

//Master Project
adminRouter.post("/master-projects", addMasterProject);
adminRouter.get("/master-projects", getAllMasterProjects);
adminRouter.get("/master-projects/:id", getMasterProjectById);
adminRouter.put("/master-projects/:id", updateMasterProject);
adminRouter.delete("/master-projects/:id", deleteMasterProject);

// SubProject Routes
adminRouter.post("/sub-projects", addSubProject);
adminRouter.get("/sub-projects", getAllSubProjects);
adminRouter.get("/sub-projects/:id", getSubProjectsById); // Note: Was getSubProjectById before, ensure this is intended
adminRouter.put("/sub-projects/:id", updateSubProject);
adminRouter.delete("/sub-projects/:id", deleteSubProject);

adminRouter.post("/bulk-project-operations", httpBulkProjectOperations);

//Time Off
adminRouter.get("/timeoff", httpGetTimeOffCategories);
adminRouter.post("/timeoff", httpAddTimeOffCategory);
adminRouter.put("/timeoff/:id", httpUpdateTimeOffCategory);
adminRouter.delete("/timeoff/:id", httpDeleteTimeOffCategory);

//Cluster
adminRouter.post("/clusters", httpAddCluster);
adminRouter.get("/clusters", httpGetCluster);
adminRouter.put("/clusters/:id", httpUpdateCluster);
adminRouter.delete("/clusters/:id", httpDeleteCluster);

//Cluster Values
adminRouter.post("/clustervalues", httpAddClusterValue);
adminRouter.get("/clustervalues/:clusterId", httpGetClusterValues);
adminRouter.put("/clustervalues/:id", httpUpdateClusterValue);
adminRouter.delete("/clustervalues/:id", httpDeleteClusterValue);

adminRouter.post("/bulk-cluster-operations", httpBulkClusterOperations);

//AD Project
adminRouter.post("/adprojects", httpAddADProject);
adminRouter.get("/adprojects", httpGetADProject);
adminRouter.put("/adprojects/:id", httpUpdateADProject);
adminRouter.delete("/adprojects/:id", httpDeleteADProject);

// WorkCategory routes
adminRouter.get("/workcategories", workController.httpGetWorkCategories); // e.g., "/workcategories?deliveryWorkTypeCategoryId=..."
adminRouter.get("/workcategories/:id", workController.httpGetWorkCategoryById);

// WorkSubCategory routes
adminRouter.get("/worksubcategories", workController.httpGetWorkSubCategories); // e.g., "/worksubcategories?workCategoryId=..."
adminRouter.get(
  "/worksubcategories/:id",
  workController.httpGetWorkSubCategoryById
);

// WorkItem routes
adminRouter.get("/workitems", workController.httpGetWorkItems); // e.g., "/workitems?workCategoryId=...&workSubCategoryId=..."
adminRouter.get("/workitems/:id", workController.httpGetWorkItemById);

// Bulk operations route for WorkCategory, WorkSubCategory, WorkItem
adminRouter.post(
  "/bulk-work-operations",
  workController.httpBulkWorkOperations
);

export default adminRouter;
