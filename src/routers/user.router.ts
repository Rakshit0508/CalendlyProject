import { Router } from "express";
import { findAllusers, findUserId } from "../controllers/user.controller.js";


export const userRouter: Router= Router();

userRouter.get('/',findAllusers);

userRouter.post('/:id',findUserId);
