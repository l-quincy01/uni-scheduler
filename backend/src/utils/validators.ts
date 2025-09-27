import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  school: z.string().min(1).max(50),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});
