import {prisma} from "../config/database.js"

export async function findBookedSlotsByHostInRange(userId:number,startDate:Date,endDate:Date){
    return prisma.slot.findMany({
        where:{
            userId,
            startAt:{
                gte:startDate,
                lte:endDate
            },
            status:"BOOKED"
        }
    })
}