import express from "express";
// import { httpGetAdminData, httpAddAdminData, } from '../controllers/admin/admin.controller.js';
import {
  httpAddCluster,
  httpAddMasterProject,
  httpGetCluster,
  httpGetMasterProject,
} from "../controllers/admin/cluster.controller.js";

const adminRouter = express.Router();

// adminRouter.post('/masterworktypes', httpAddAdminData);
// adminRouter.post('/deliveryworktypes', httpGetAdminData);

adminRouter.post("/clusters", httpAddCluster);
adminRouter.get("/clusters", httpGetCluster);

adminRouter.post("/masterproject", httpAddMasterProject);
adminRouter.get("/masterproject", httpGetMasterProject);

export default adminRouter;
