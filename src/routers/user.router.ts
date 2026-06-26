import { Router } from "express";
import { createSingleUser, deleteSingleUser, findAllusers, findUserId, updateSingleUser } from "../controllers/user.controller.js";
import { createUserSchema } from "../dtos/user.dto.js";
import { validate } from "../middlewares/validate.js";


export const userRouter: Router= Router();

userRouter.get('/',findAllusers);
userRouter.post("/create",validate(createUserSchema),createSingleUser);
userRouter.delete("/delete", deleteSingleUser);
userRouter.put("/update",updateSingleUser);
userRouter.get('/:id',findUserId);


