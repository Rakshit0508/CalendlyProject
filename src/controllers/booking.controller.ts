import { Request, Response } from "express";
import { createBookingOptimistically } from "../services/booking.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function createNewBooking(req:Request,res:Response){
    const userId= req.userId;
    const response= await createBookingOptimistically(userId,req.body);
    sendSuccess(res,response,201,'Booking created successfully');
}
