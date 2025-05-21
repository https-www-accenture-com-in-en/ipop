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
  httpAddCluster,
  httpAddMasterProject,
  httpGetCluster,
  httpGetMasterProject,
} from "../controllers/admin/cluster.controller.js";
<<<<<<< Updated upstream
import { httpAddMetadata, httpGetMetadata } from '../controllers/admin/metadata.controller.js';
import {
  httpGetTimeOffCategories,
  httpAddTimeOffCategory,
  httpUpdateTimeOffCategory,
  httpDeleteTimeOffCategory,
} from "../controllers/admin/timeoff.controller.js";
=======
import { httpMetadata } from "../controllers/admin/metadata.controller.js";
>>>>>>> Stashed changes

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

//SCREEN 9 FURTHER WORK
adminRouter.post("/clusters", httpAddCluster);
adminRouter.get("/clusters", httpGetCluster);

adminRouter.post("/masterprojects", httpAddMasterProject);
adminRouter.get("/masterprojects", httpGetMasterProject);

<<<<<<< Updated upstream

//SCREEN 4 
adminRouter.post('/ticket-metadata',httpAddMetadata);
adminRouter.get('/ticket-metadata',httpGetMetadata)

adminRouter.get("/timeoff", httpGetTimeOffCategories);
adminRouter.post("/timeoff", httpAddTimeOffCategory);
adminRouter.put("/timeoff/:id", httpUpdateTimeOffCategory);
adminRouter.delete("/timeoff/:id", httpDeleteTimeOffCategory);
=======
//SCREEN 4
adminRouter.post("/ticket-metadata", httpMetadata);
>>>>>>> Stashed changes

export default adminRouter;
