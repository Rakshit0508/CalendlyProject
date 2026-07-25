import {prisma} from "../config/database.js"
import { updateBookingDto } from "../dtos/booking.dto.js";
import { DbClient, getDbClient } from "./db-client.js"

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

export async function findSlotBySlotId(slotId:string, db?: DbClient){
    const client= getDbClient(db);
    return client.slot.findUnique({
        where:{
            slotId
        }
    })
}

export async function findSlotBySlotIdPessimistically(slotId: string, tx: DbClient){
    const client= getDbClient(tx);
    return await client.$queryRaw<{slotId: string}[]>`
    SELECT slotId
    FROM slots
    WHERE slotId= ${slotId}
    FOR UPDATE
    `;
}

export async function updateSlot(data: updateBookingDto, db?: DbClient){
    const client= getDbClient(db);
    return client.slot.updateMany({
        where:{
            slotId: data.slotId,
            status:"AVAILABLE"
        },
        data:{
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
