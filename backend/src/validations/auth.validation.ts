import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  school: z.string().min(1).max(50),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string().min(8).max(72),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .optional(),
  school: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});
