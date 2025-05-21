import express from "express";
import { httpCreateMasterDeliveryWT } from "../controllers/admin/master-delivery.controller.js";
import {
  httpAddCluster,
  httpAddMasterProject,
  httpGetCluster,
  httpGetMasterProject,
} from "../controllers/admin/cluster.controller.js";
import { httpMetadata } from '../controllers/admin/metadata.controller.js';

const adminRouter = express.Router();

//SCREEN1
adminRouter.post("/masteranddeliveryworktypes", httpCreateMasterDeliveryWT);

//SCREEN 9 FURTHER WORK
adminRouter.post("/clusters", httpAddCluster);
adminRouter.get("/clusters", httpGetCluster);

adminRouter.post("/masterprojects", httpAddMasterProject);
adminRouter.get("/masterprojects", httpGetMasterProject);


//SCREEN 4 
adminRouter.post('/ticket-metadata',httpMetadata);

export default adminRouter;
