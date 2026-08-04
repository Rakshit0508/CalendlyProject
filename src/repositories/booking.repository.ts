import { createBookingDto } from "../dtos/booking.dto.js";
import { DbClient, getDbClient } from "./db-client.js";
import {prisma} from '../config/database.js'
export async function createNewBooking(userId: number,
    eventTypeId: number,
    data: createBookingDto,
    tx?: DbClient){
        const client= getDbClient(tx);
        return client.booking.create({
        data:{
            slotId:data.slotId,
            inviteeEmail:data.inviteeEmail,
            inviteeName:data.inviteeName,
            inviteeNotes:data.inviteeNotes,
            status:"CONFIRMED",
            userId,
            eventTypeId
        },
        include:{
            slot:true
        }
    })
}

export async function findBookingById(bookingId: number){
    const booking= await prisma.booking.findUnique({
        where:{
            bookingId
        },
        include:{
            slot:true,
            eventType:true
        }
    });
    return booking;
}
