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

export async function upsertAvailableSlots(userId:number, eventTypeId:number,startAt:Date,endAt:Date){
    return prisma.slot.upsert({
        where:{
            eventTypeId_startAt_endAt:{
                eventTypeId,
                startAt,
                endAt
            }
        },
        create:{
            userId,
            eventTypeId,
            startAt,
            endAt,
            status:"AVAILABLE"
        },
        update:{
            status:"AVAILABLE"
        }
    })
}

export async function findFutureSlotsInRange(eventTypeId:number,startDate:Date,endDate:Date){
    return prisma.slot.findMany({
        where:{
            eventTypeId,
            startAt:{
                gte:startDate,
                lte:endDate
            },
            status:{in:["AVAILABLE","BLOCKED"]}
        }
    })
}

export async function blockInvalidSlots(invalidId:string[]){
    return prisma.slot.updateMany({
        where:{
            slotId:{
                in: invalidId
            }
        },
        data:{
            status:"BLOCKED"
        }
    })
}