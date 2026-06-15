import { Router } from "express";
import { findAllusers } from "../controllers/user.controller.js";


export const userRouter: Router= Router();

userRouter.get('/',findAllusers);
