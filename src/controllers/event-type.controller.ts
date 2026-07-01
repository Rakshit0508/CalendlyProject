import { getEventByEventId as getEventByEventIdService, listEventTypes as listEventTypesService,
createEventType as createEventTypeService,removeEventType as removeEventTypeService,
getEventTypePublic as getEventTypePublicService,updateEventType as updateEventTypeService } from "../services/event-types.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { Request,Response } from "express";

 
 export async function listEventTypes(req:Request,res:Response){
    const eventTypes= await listEventTypesService(req.userId);
    sendSuccess(res,eventTypes);
 }

 export async function getEventById(req:Request,res:Response){
    const {id}= req.params;
    const eventType= await getEventByEventIdService(Number(id));
    sendSuccess(res,eventType);
 }

 export async function createEventType(req:Request,res:Response){
    const userId= req.userId;
    const eventType= await createEventTypeService(userId,req.body);
    sendSuccess(res,eventType,201,'Event created successfully');
 }

 export async function removeEventType(req:Request,res:Response){
    const {id}= req.params;
    await removeEventTypeService(req.userId,Number(id));
    sendSuccess(res,null,200,'Event type deleted successfully');
 }

export async function getEventTypePublic(req:Request,res:Response){
    const {userId, slug}= req.params;
    const eventType= await getEventTypePublicService(Number(userId),String(slug));
    sendSuccess(res,eventType);
}

export async function updateEventType(req:Request,res:Response){
    const {id}= req.params;
    const eventType= await updateEventTypeService(req.userId,Number(id),req.body);
    sendSuccess(res,eventType,200,'Event updated successfully');
}