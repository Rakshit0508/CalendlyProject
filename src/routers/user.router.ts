import { Router } from "express";
import { createSingleUser, deleteSingleUser, findAllusers, findUserId, updateSingleUser } from "../controllers/user.controller.js";


export const userRouter: Router= Router();

userRouter.get('/',findAllusers);
userRouter.post("/create",createSingleUser);
userRouter.delete("/delete", deleteSingleUser);
userRouter.put("/update",updateSingleUser);
userRouter.get('/:id',findUserId);


