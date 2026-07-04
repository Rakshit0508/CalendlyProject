import {z} from 'zod';

const timeRegex= /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex= /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

export const createAvailabilityRuleSchema= z.object({
    weekday: z.number().int().min(0).max(6),
    startTime: z.string().regex(timeRegex,"Start time must be in HH:mm format"),
    endTime: z.string().regex(timeRegex,"End time must be in HH:mm format"),
    isActive: z.boolean().default(true),
    timezone: z.string().default("UTC")
}).superRefine((data,ctx)=>{
    if(data.startTime>= data.endTime){
        ctx.addIssue({
            code: 'custom',
            path:["endTime"],
            message:"startTime should be less than endTime"
        })
    }
})

export const updateAvailabilityRuleSchema= createAvailabilityRuleSchema.partial().superRefine((data,ctx)=>{
    if(data.startTime && data.endTime && data.startTime>data.endTime){
        ctx.addIssue({
            code:'custom',
            path:['endTime'],
            message:"startTime should be less than endTime"
        })
    }
});

export const createAvailabilityExceptionSchema= z.object({
    date: z.string().regex(dateRegex,"Date must be YYYY-MM-DD format"),
    type: z.enum(["BLOCK_FULL_DAY","BLOCK_PARTIAL","ADD_AVAILABLE_WINDOW"]),
    startTime: z.string().regex(timeRegex,"Start time must be in HH:mm format").optional(),
    endTime: z.string().regex(timeRegex,"End time must be in HH:mm format").optional(),
    timezone: z.string().default("UTC"),
    reason: z.string().max(500).optional()
}).superRefine((data,ctx)=>{
    if(data.type!=='BLOCK_FULL_DAY' && !data.startTime && !data.endTime){
        ctx.addIssue({
            code:'custom',
            path:['startTime','endTime'],
            message:"startTime and endTime is required for non-full day block exceptions"
        })
    }
    if(data.startTime && data.endTime && data.startTime>data.endTime){
        ctx.addIssue({
            code:'custom',
            path:['endTime'],
            message:"startTime should be less than endTime"
        })
    }
});

export const updateAvailabilityExceptionSchema= createAvailabilityExceptionSchema.partial().superRefine((data,ctx)=>{
    if(data.type!=='BLOCK_FULL_DAY' && !data.startTime && !data.endTime){
        ctx.addIssue({
            code:'custom',
            path:['startTime','endTime'],
            message:"startTime and endTime is required for non-full day block exceptions"
        })
    }
    if(data.startTime && data.endTime && data.startTime>data.endTime){
        ctx.addIssue({
            code:'custom',
            path:['endTime'],
            message:"startTime should be less than endTime"
        })
    }
});;

export type CreateAvailabilityRuleDto= z.infer<typeof createAvailabilityRuleSchema>;
export type UpdateAvailabilityRuleDto= z.infer<typeof updateAvailabilityRuleSchema>;
export type CreateAvailabilityExceptionDto= z.infer<typeof createAvailabilityExceptionSchema>;
export type UpdateAvailabilityExceptionDto= z.infer<typeof updateAvailabilityExceptionSchema>