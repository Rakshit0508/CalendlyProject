import { findBookedSlotsByHostInRange } from "../repositories/slot.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { notFound } from "../utils/api-error.js";

export async function findBookedSlotsByHostIdInRange(userId:number,startDate:Date,endDate:Date){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found")
    }
    return findBookedSlotsByHostInRange(userId,startDate,endDate);
}