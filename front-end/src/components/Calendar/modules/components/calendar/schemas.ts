import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Invalid date format",
  }),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "Invalid date format",
  }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"], {
    required_error: "Variant is required",
    invalid_type_error: "Invalid color option",
  }),
});

export type TEventFormData = z.infer<typeof eventSchema>;
