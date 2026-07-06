import { Router } from "express";
import { createSingleUser, deleteSingleUser, findAllusers, findUserById, updateSingleUser } from "../controllers/user.controller.js";
import { createUserSchema, updateUserSchema } from "../dtos/user.dto.js";
import { validate } from "../middlewares/validate.js";

export const userRouter: Router= Router();

userRouter.get('/',findAllusers);
userRouter.post("/create",validate(createUserSchema),createSingleUser);
userRouter.delete("/delete/:userId", deleteSingleUser);
userRouter.put("/update/:userId",validate(updateUserSchema),updateSingleUser);
userRouter.get('/:userId',findUserById);


