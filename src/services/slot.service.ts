import { findExceptionsByUserInRange, findActiveRulesByUser } from "../repositories/availability.repository.js";
import { findActiveEventTypesByHost } from "../repositories/event-type.repository.js";
import { findBookedSlotsByHostInRange } from "../repositories/slot.repository.js"; 
import {DateTime} from "luxon";
import {prisma} from "../config/database.js";
import { SLOT_GENERATION_DAYS } from "../config/env.js";
import { TimeWindow, applyExceptionsForDate, overlapsBooked, splitIntoSlots, windowsForWeekdayRule } from "./slot-generation.service.js";

// export async function findBookedSlotsByHostIdInRange(userId:number,startDate:Date,endDate:Date){
//     const user= await getUserById(userId);
//     if(!user){
//         throw notFound("User not found")
//     }
//     return findBookedSlotsByHostInRange(userId,startDate,endDate);
// }

export interface RegenerateHostSlotsInput{
    userId: number,
    from?: string, // yyyy-mm-dd
    to?: string // yyyy-mm-dd   
}

export async function regenerateHostSlots(input: RegenerateHostSlotsInput){
    const host= await prisma.user.findUnique({where:{userId:input.userId}});
    if(!host) return;

    const from= input.from? DateTime.fromISO(input.from,{zone:"UTC"}).startOf('day'): DateTime.now().startOf('day');
    const to= input.to? DateTime.fromISO(input.to,{zone:"UTC"}).endOf('day'): from.plus({days:SLOT_GENERATION_DAYS}).endOf('day');

    const [rules,exceptions,eventTypes,bookedSlots]= await Promise.all([
        findActiveRulesByUser(input.userId),
        findExceptionsByUserInRange(input.userId,from.toJSDate(),to.toJSDate()),
        findActiveEventTypesByHost(input.userId),
        findBookedSlotsByHostInRange(input.userId,from.toJSDate(),to.toJSDate())
    ])

    // coverty booked slots to time windows-> compatible with luxon
    const bookedWindows: TimeWindow[]= bookedSlots.map((slot)=>{
        return{
            start: DateTime.fromJSDate(slot.startAt,{zone:'utc'}),
            end: DateTime.fromJSDate(slot.endAt,{zone:'utc'})
        }
    });

    for(const eventType of eventTypes){
        for(let cursor= from;cursor<= to;cursor=cursor.plus({days:1})){
            const dateKey= cursor.toISODate(); // 2026-06-01
            const dayExceptions= exceptions.filter((ex)=> DateTime.fromJSDate(ex.date,{zone:'utc'}).toISODate()===dateKey)
            const dayExceptionsWithTimeZone= dayExceptions.map((ex)=>({
                type:ex.type,
                startTime: ex.startTime,
                endTime: ex.endTime,
                timeZone: ex.timezone
            }))
            let windows:TimeWindow[]=[];
            // convert rules into timewindows-> compatible for luxon
            for(const rule of rules){
                windows.push(...windowsForWeekdayRule(cursor,rule.weekday,rule.startTime,rule.endTime,rule.timezone));
            }
            // apply exceptions to the windows
            windows= applyExceptionsForDate(cursor,windows,dayExceptionsWithTimeZone);
            const slots= splitIntoSlots(
                windows, // windows on which exceptions are applied
                eventType.durationMinutes,
                eventType.bufferBeforeMinutes,
                eventType.bufferAfterMinutes
            ).filter(
                (slot)=> slot.start> DateTime.utc() && !overlapsBooked(slot,bookedWindows,eventType.bufferBeforeMinutes,eventType.bufferAfterMinutes)
            ); // slots filtered to exclude past slots and slots that overlapped with booked slots

            for(const slot of slots){
                const startAt= slot.start.toUTC().toJSDate();
                const endAt= slot.end.toUTC().toJSDate();
                const key= `${eventType.eventTypeId}| ${startAt.toISOString()}| ${endAt.toISOString()}`;

                await prisma.slot.upsert({
                    where:{
                        eventTypeId_startAt_endAt:{
                            eventTypeId: eventType.eventTypeId,
                            startAt,
                            endAt
                        }
                    },
                    create:{
                        userId: input.userId,
                        eventTypeId:eventType.eventTypeId,
                        startAt,
                        endAt,
                        status:"AVAILABLE"
                    },
                    update:{
                        status:"AVAILABLE"
                    }
                })
            }
        }
    }
}