import express from 'express';
import { httpGetAdminData, httpCreateMasterDataL1, httpcreateDeliveryDataL2 } from '../controllers/admin.controller.js';

const adminRouter = express.Router();

adminRouter.get('/', httpGetAdminData);
adminRouter.post('/masterworktypes', httpCreateMasterDataL1);
adminRouter.post('/deliveryworktypes', httpcreateDeliveryDataL2);

export default adminRouter;