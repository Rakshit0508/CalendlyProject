import {z} from "zod";


export const createBookingSchema= z.object({
    slotId: z.string(),
    inviteeEmail: z.email('Email address is invalid'),
    inviteeNotes: z.string().optional(),
    inviteeName: z.string('Name should be more than 1 and less than 100 characters'),
    status: z.string().default("PENDING"),
    meetLink: z.string().optional(),
    calenderEventId: z.string().optional(),
    cancelledAt: z.date().optional()
})

export const updateBookingSchema= createBookingSchema.partial();

export type createBookingDto= z.infer<typeof createBookingSchema>;
export type updateBookingDto= z.infer<typeof updateBookingSchema>;