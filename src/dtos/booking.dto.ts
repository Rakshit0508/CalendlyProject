import {z} from "zod";


export const createBookingSchema= z.object({
    inviteeEmail: z.string(),
    inviteeNotes: z.string().optional(),
    inviteeName: z.string(),
    status: z.string().default("PENDING"),
    meetLink: z.string().optional(),
    calenderEventId: z.string().optional(),
    cancelledAt: z.date().optional()
})

export const updateBookingSchema= createBookingSchema.partial();

export type createBookingDto= z.infer<typeof createBookingSchema>;
export type updateBookingDto= z.infer<typeof updateBookingSchema>;