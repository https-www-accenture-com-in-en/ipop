import express from 'express';
import httpAddUserData from '../controllers/user/user.controller.js';

const userRouter = express.Router();

userRouter.post('/user', httpAddUserData );

export default userRouter;