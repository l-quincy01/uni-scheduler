import { z } from "zod";

export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional().or(z.literal("")),
  school: z.string().optional().or(z.literal("")),
});

export type ProfileForm = z.infer<typeof ProfileSchema>;
