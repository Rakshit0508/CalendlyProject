import {DateTime,Interval} from "luxon";

export interface TimeWindow{
    start: DateTime,
    end:DateTime
}

export function parseTimeOnDate(date:DateTime // requires luxon date time
    , time:string,timezone:string){
    const [hour,minute]= time.split(":").map(Number);
    return date.setZone(timezone).set({
        hour,
        minute,
        second:0,
        millisecond:0
    })
}

export function mergeWindows(window:TimeWindow[]):TimeWindow[]{
    if(window.length===0){
        return [];
    }
    const sorted= [...window].sort((a,b)=> a.start.toMillis()-b.start.toMillis());
    const mergedResult:TimeWindow[]= [sorted[0]];
    for(let i=1;i<sorted.length;i++){
        const current= sorted[i];
        const last= mergedResult[mergedResult.length-1];
        if(current.start<= last.end){
            last.end= current.end>last.end? current.end: last.end;
        }
        else{
            mergedResult.push(current);
        }
    }
    return mergedResult;
}

export function spiltIntoSlots(windows:TimeWindow[],durationMinutes: number,
     buferBeforeMinutes:number,bufferAfterMinutes:number): TimeWindow[]{
        const slots: TimeWindow[]=[];
        const totalMinutes= durationMinutes + buferBeforeMinutes + bufferAfterMinutes;

        for(const window of windows){
            let cursor= window.start;

            while(cursor.plus({minutes: totalMinutes})<= window.end){
                const slotStart= cursor.plus({minutes:buferBeforeMinutes});
                const slotEnd= slotStart.plus({minutes:durationMinutes});

                slots.push({start:slotStart,end:slotEnd});
                cursor.plus({minutes:durationMinutes}); // this is efficient packing. to change use totalMinutes.
            }
        }
        return slots;
}

// split windows due to partial block exceptions
// we are considering a single block window at a time.
export function subtractWindows(windows: TimeWindow[],block: TimeWindow):TimeWindow[]{ 
    const result: TimeWindow[]=[];
    for(const window of windows){
        const interval= Interval.fromDateTimes(window.start,window.end);
        const blockInterval= Interval.fromDateTimes(block.start,block.end);

        if(!interval.overlaps(blockInterval)){
            result.push(window);
            continue;
        }

        if(block.start> window.start){
            result.push({start: window.start, end:block.start});
        }

        if(block.end< window.end){
            result.push({start:block.end,end:window.end});
        }
    }
    return result.filter((w)=> w.end>= w.start); // drop zero length intervals
}

// filter out already booked slots, here we are considering one slot at a time 
export function overlapsBooked(slot: TimeWindow, booked:TimeWindow[],
    buferBeforeMinutes:number,bufferAfterMinutes:number): boolean{

        const paddedStart= slot.start.minus({minutes:buferBeforeMinutes});
        const paddedEnd= slot.end.plus({minutes:bufferAfterMinutes});

        return booked.some((b)=>{
            const interval= Interval.fromDateTimes(paddedStart,paddedEnd);
            const bookedInterval= Interval.fromDateTimes(b.start,b.end);
            return interval.overlaps(bookedInterval);
        })
    }

// apply exceptions for a particular date.
export function applyExceptionsForDate( date:DateTime, baseWindows: TimeWindow[],
    exceptions: Array<{
        type:"BLOCK_FULL_DAY"| "BLOCK_PARTIAL" | "ADD_AVAILABLE_WINDOW",
        startTime: string|null,
        endTime: string|null,
        timeZone: string
    }>): TimeWindow[]{

        let windows= [...baseWindows];

        for(const ex of exceptions){
            if(ex.type==="BLOCK_FULL_DAY"){
                return [];
            }

            if(ex.type==="BLOCK_PARTIAL" && ex.startTime && ex.endTime){
                const block= {
                    start: parseTimeOnDate(date,ex.startTime,ex.timeZone),
                    end: parseTimeOnDate(date,ex.endTime,ex.timeZone)
                };
                windows= subtractWindows(windows,block);
            }

            if(ex.type==="ADD_AVAILABLE_WINDOW" && ex.startTime && ex.endTime){
                const addWindow= {
                    start: parseTimeOnDate(date,ex.startTime,ex.timeZone),
                    end: parseTimeOnDate(date,ex.endTime,ex.timeZone)
                };
                windows.push(addWindow);
            }
        }
        return mergeWindows(windows);
    }
