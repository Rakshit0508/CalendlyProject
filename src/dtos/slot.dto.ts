import {z} from "zod";

export const createHostSlotsSchema= z.object({
    startAt: z.date(),
    endAt: z.date(),
    status: z.string().default("AVAILABLE")
})

export const updateHostSlotsSchema= createHostSlotsSchema.partial();

export type createHostSlotsDto= z.infer<typeof createHostSlotsSchema>;