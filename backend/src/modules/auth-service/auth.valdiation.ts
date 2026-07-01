import z, { email } from "zod";
import { UserRole } from "../../../generated/prisma/enums";

export const registerSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long").max(100),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    passwordHash: z.string().min(6, "Password must be at least 6 characters long").max(100),
    role: z.nativeEnum(UserRole).optional(),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    passwordHash: z.string().min(6, "Password must be at least 6 characters long").max(100),
})  

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;