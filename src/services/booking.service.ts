import { prisma } from "../config/database.js";
import { createBookingDto} from "../dtos/booking.dto.js";
import { findSlotBySlotId, findSlotBySlotIdPessimistically,
 updateSlot as markedSlotBookedIfAvailable } from "../repositories/slot.repository.js";
import { badRequest, notFound } from "../utils/api-error.js";
import { Slot } from "../../generated/prisma/client.js";
import { createNewBooking } from "../repositories/booking.repository.js";
import { startRegenerateHostSlotsWorkflow, startSendBookingConfirmationEmailWorkflow } from "../temporal/client.js";

export function validateSlotInfo(slot:Slot | null){
    if(!slot){
        throw notFound('Slot not found');
    }

    if(slot.status!=='AVAILABLE'){
        throw badRequest('Slot not available');
    }

    if(slot.startAt< new Date()){
        throw badRequest('Slot has already started')
    };
}

function formatBookingResponse( booking: {
    bookingId: number,
    status: string,
    slot:{startAt: Date, endAt: Date}
}){
    return {
        booking: {
            bookingId: booking.bookingId,
            status: booking.status,
            startAt: booking.slot.startAt.toISOString(),
            endAt: booking.slot.endAt.toISOString(),
        },
    };
}

async function triggerSlotRegen(userId:number, slotStartAt: Date){
    const date= slotStartAt.toISOString().split('T')[0];
    await startRegenerateHostSlotsWorkflow({
        userId,
        from: date,
        to: date
    }
    );
    console.log(`[booking] Triggering slot regeneration for host ${userId}
    on date ${date}
    `)
}

 async function postBookingActions(userId: number,booking: {
    bookingId: number,
    status: string,
    slot:{startAt: Date, endAt: Date}
}){
    await triggerSlotRegen(userId, booking.slot.startAt);
    await startSendBookingConfirmationEmailWorkflow(booking.bookingId);
    return formatBookingResponse(booking);
}

// In optimistic locking, technically we are allowing all the queries to 
// start a transaction, it's just that only one of them will get the
// status as Available and can convert it to booked.
// since we are not writing the isolation level than it would be default of
// postgres that is read-committed.

export async function createBookingOptimistically(userId:number,data: createBookingDto){
    const booking= await prisma.$transaction(async(tx)=>{
        const slot= await findSlotBySlotId(data.slotId,tx);
        validateSlotInfo(slot);
        const updated= await markedSlotBookedIfAvailable(data, tx);
        if(updated.count!==1){
            throw badRequest('Slot is not available')
        }

        return createNewBooking(userId,slot.eventTypeId,data,tx);
    })
    return postBookingActions(userId,booking);
}

export async function createBookingPessimistically(userId: number, data: createBookingDto){
    const booking= await prisma.$transaction(async (tx)=>{
    const locked= await findSlotBySlotIdPessimistically(data.slotId,tx);
    if(locked.length===0){
        throw notFound('Slot not found')
    }
    const slot= await findSlotBySlotId(data.slotId,tx);
    validateSlotInfo(slot);
    const updated= await markedSlotBookedIfAvailable(data, tx);
    if(updated.count!==1){
        throw badRequest('Slot is not available')
    }
    return createNewBooking(userId,slot.eventTypeId,data,tx);
    })
    return postBookingActions(userId,booking);
}