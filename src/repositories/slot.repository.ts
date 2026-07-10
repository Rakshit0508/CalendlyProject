import {prisma} from "../config/database.js"
import { createHostSlotsDto } from "../dtos/slot.dto.js"

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

export async function createHostSlots(userId:number,eventTypeId:number, data: createHostSlotsDto){
    return prisma.slot.create({
        data:{
            userId,
            eventTypeId,
            ...data
        }
    })
}

export async function getHostSlots(userId:number,eventTypeId:number){
    return prisma.slot.findMany({
        where:{
            userId,
            eventTypeId,
        },
        orderBy:[{
            startAt:"asc"
        }]
    })
}