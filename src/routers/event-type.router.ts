import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createEventTypeSchema, updateEventTypeSchema } from "../dtos/event-type.dto.js";
import {createEventType,getEventById,listEventTypes,removeEventType,updateEventType} from "../controllers/event-type.controller.js" 
import { requireUserId } from "../middlewares/require-user-id.js";

export const eventTypeRouter: Router= Router({mergeParams:true});

eventTypeRouter.use(requireUserId);

eventTypeRouter.get('/',listEventTypes);
eventTypeRouter.get('/:id',getEventById);
eventTypeRouter.post('/',validate(createEventTypeSchema),createEventType);
eventTypeRouter.patch('/:id',validate(updateEventTypeSchema),updateEventType);
eventTypeRouter.delete('/:id',removeEventType);