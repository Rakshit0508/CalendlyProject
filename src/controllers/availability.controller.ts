import { Request,Response} from "express";
import { findAvailabilityRulesByUser as findAvailabilityRulesByUserService,findAvailabilityRulesById as findAvailabilityRulesByIdService,
createAvailabilityRule as createAvailabilityRuleService,updateAvailabilityRule as updateAvailabilityRuleService,
 removeAvailabilityRule as removeAvailabilityRuleService,findAvailabilityExceptionsByUser as findAvailabilityExceptionsByUserService,
findAvailabilityExceptionById as findAvailabilityExceptionByIdService,createAvailabilityException as createAvailabilityExceptionSchema,
updateAvailabilityException as updateAvailabilityExceptionService,removeAvailabilityException as removeAvailabilityExceptionService,
findAvailabilityExceptionsByUserInRange as findAvailabilityExceptionsByUserInRangeService} from "../services/availability.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function findAvailabilityRulesByUser(req:Request,res:Response){
    const response= await findAvailabilityRulesByUserService(Number(req.userId));
    sendSuccess(res,response)
}

export async function findAvailabilityRulesById(req:Request,res:Response){
    const {ruleId}= req.params;
    const response= await findAvailabilityRulesByIdService(Number(ruleId));
    sendSuccess(res,response)
}

export async function createAvailabilityRule(req:Request,res:Response){
    const response= await createAvailabilityRuleService(Number(req.userId),req.body);
    sendSuccess(res,response,201,"Availability rule created successfully");
}

export async function updateAvailabilityRule(req:Request,res:Response){
    const {ruleId}= req.params;
    const response= await updateAvailabilityRuleService(Number(req.userId),Number(ruleId),req.body);
    sendSuccess(res,response,200,"Availability rule updated successfully");
}

export async function removeAvailabilityRule(req:Request,res:Response){
    const {ruleId}= req.params;
    const response= await removeAvailabilityRuleService(Number(req.userId),Number(ruleId));
    sendSuccess(res,response,200,"Availability rule deleted successfully"); 
}

export async function findAvailabilityExceptionsByUser(req:Request,res:Response){
    const response= await findAvailabilityExceptionsByUserService(Number(req.userId));
    sendSuccess(res,response);
}

export async function findAvailabilityExceptionById(req:Request,res:Response){
    const {exceptionId}= req.params;
    const response= await findAvailabilityExceptionByIdService(Number(exceptionId));
    sendSuccess(res,response);
}

export async function createAvailalbilityException(req:Request,res:Response){
    const response= await createAvailabilityExceptionSchema(Number(req.userId),req.body);
    sendSuccess(res,response,201,"Availability exception created successfully");
}

export async function updateAvailabilityException(req:Request,res:Response){
    const {exceptionId}= req.params;
    const response= await updateAvailabilityExceptionService(Number(req.userId),Number(exceptionId),req.body);
    sendSuccess(res,response,200,"Availabilty exception updated successfully");
}

export async function removeAvailabilityException(req:Request,res:Response){
    const {exceptionId}= req.params;
    const response= await removeAvailabilityExceptionService(Number(req.userId),Number(exceptionId));
    sendSuccess(res,response,200,"Availability exception deleted successfully");
}

export async function findAvailabilityExceptionsByUserInRange(req:Request,res:Response){
    const {startDate,endDate}= req.body;
    const response= await findAvailabilityExceptionsByUserInRangeService(Number(req.userId),startDate,endDate);
    sendSuccess(res,response);
}