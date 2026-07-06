import { Request,Response } from "express";
import { sendSuccess } from "../utils/api-response.js";
import { findBookedSlotsByHostIdInRange as findBookedSlotsByHostIdInRangeService } from "../services/slot.service.js";

export async function findBookedSlotsByHostIdInRange(req:Request,res:Response){
    const {startDate,endDate}= req.body;
    const response= await findBookedSlotsByHostIdInRangeService(Number(req.userId),startDate,endDate);
    sendSuccess(res,response);
}