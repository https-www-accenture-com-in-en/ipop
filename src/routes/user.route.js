import express from "express";
import {
  //   httpAddUserData,
  httpGetApprovalDetails,
} from "../controllers/user/user.controller.js";

const userRouter = express.Router();

// userRouter.post("/user", httpAddUserData);
userRouter.get("/approval-action", httpGetApprovalDetails);

export default userRouter;
