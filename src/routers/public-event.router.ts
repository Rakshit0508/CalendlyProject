import { Router } from "express";
import {getEventTypePublic} from "../controllers/event-type.controller.js"
import { requireUserId } from "../middlewares/require-user-id.js";
export const publicEventRouter: Router= Router();

publicEventRouter.use(requireUserId)
publicEventRouter.get('/users/event-types/:slug', getEventTypePublic);