import {Router} from "express";
import { requireUserId } from "../middlewares/require-user-id.js";
import { createNewBooking } from "../controllers/booking.controller.js";

export const bookingRouter:Router= Router();

bookingRouter.use(requireUserId);
bookingRouter.post('/',createNewBooking);