import { findExceptionsByUserInRange, findActiveRulesByUser } from "../repositories/availability.repository.js";
import { findActiveEventTypesByHost } from "../repositories/event-type.repository.js";
import { blockInvalidSlots, findBookedSlotsByHostInRange, findFutureSlotsInRange, upsertAvailableSlots } from "../repositories/slot.repository.js"; 
import {DateTime} from "luxon";
import { SLOT_GENERATION_DAYS } from "../config/env.js";
import { TimeWindow, applyExceptionsForDate, overlapsBooked, splitIntoSlots, windowsForWeekdayRule } from "./slot-generation.service.js";
import { getUserById } from "../repositories/user.repository.js";

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
    const host= await getUserById(input.userId);
    if(!host) return;

    const from= input.from? DateTime.fromISO(input.from,{zone:"UTC"}).startOf('day'): DateTime.now().startOf('day').toUTC();
    const to= input.to? DateTime.fromISO(input.to,{zone:"UTC"}).endOf('day'): from.plus({days:SLOT_GENERATION_DAYS}).endOf('day').toUTC();

    const [rules,exceptions,eventTypes,bookedSlots]= await Promise.all([
        findActiveRulesByUser(input.userId),
        findExceptionsByUserInRange(input.userId,from.toJSDate(),to.toJSDate()),
        findActiveEventTypesByHost(input.userId),
        findBookedSlotsByHostInRange(input.userId,from.toJSDate(),to.toJSDate())
    ])

    // convert booked slots to time windows-> compatible with luxon
    const bookedWindows: TimeWindow[]= bookedSlots.map((slot)=>{
        return{
            start: DateTime.fromJSDate(slot.startAt,{zone:'utc'}),
            end: DateTime.fromJSDate(slot.endAt,{zone:'utc'})
        }
    });

    for(const eventType of eventTypes){
        const generatedValidSlotKeys= new Set<string>();
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
                (slot)=> slot.start> DateTime.utc() 
                && 
                !overlapsBooked(slot,bookedWindows,eventType.bufferBeforeMinutes,eventType.bufferAfterMinutes)
            ); // slots filtered to exclude past slots and slots that overlapped with booked slots

            for(const slot of slots){
                const startAt= slot.start.toUTC().toJSDate();
                const endAt= slot.end.toUTC().toJSDate();
                const key= `${eventType.eventTypeId}|${startAt.toISOString()}|${endAt.toISOString()}`;
                generatedValidSlotKeys.add(key);
                await upsertAvailableSlots(input.userId,eventType.eventTypeId,startAt,endAt);
            }
        }
        const futureSlots= await findFutureSlotsInRange(eventType.eventTypeId,from.toJSDate(),to.toJSDate());
        const invalidId: string[]=[];
        for(const slot of futureSlots){
            const key= `${eventType.eventTypeId}|${slot.startAt.toISOString()}|${slot.endAt.toISOString()}`; 
            if(!generatedValidSlotKeys.has(key)){
                invalidId.push(slot.slotId);
            }
        }
        if(invalidId.length>0){
            await blockInvalidSlots(invalidId);
        }
    }
}

// invalidSlots = all slots in my db- new slots.