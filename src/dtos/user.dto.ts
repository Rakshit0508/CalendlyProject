import {z} from 'zod';

export const createUserSchema= z.object({
    email:z.email('Invalid email address'),
    name: z.string().min(1,'Name is required').max(100,'Name should be less than 100 characters'),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/,'Slug may only contain lowercase letters,numbers and hyphen').optional()
});

export const updateUserSchema= z.object({
    email:z.email('Invalid email address').optional(),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/,'Slug may only contain lowercase letters,numbers and hyphen').optional(),
    name: z.string().min(1,'Name is required').max(100,'Name should be less than 100 characters').optional()
}).refine(
    (data) => data.email !== undefined || data.name !== undefined,
    {
      message: "At least one field (email or name) must be provided.",
    }
  );

export type CreateUserDto= z.infer<typeof createUserSchema>;
export type UpdateUserDto= z.infer<typeof updateUserSchema>;
