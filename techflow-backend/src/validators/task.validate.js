import { z } from "zod";
import mongoose from "mongoose";

const taskSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Invalid Type Error",
    })
    .trim()
    .min(3, { message: "Minimum Length should be 3 char" }),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Invalid String Type",
    })
    .trim()
    .min(10, { message: "Minimum length should be 10 char" }),
  projectId: z
    .string({
      required_error: "Project ID is required",
      invalid_type_error: "Project ID must be a string",
    })
    .refine((id) => !id || mongoose.isValidObjectId(id), {
      message: "Invalid user Id format",
    }),
  assignedTo: z
    .string({
      invalid_type_error: "Assigned user ID must be a string",
    })
    .refine((id) => !id || mongoose.isValidObjectId(id), {
      message: "Invalid user Id format",
    })
    .optional(),
  status: z.enum(["ToDo", "In-Progress", "Done"]).default("ToDo"),
  dueDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
      z.date()
    )
    .refine((date) => date > new Date(), {
      message: "Due Date must be in the future",
    }),
});

export default taskSchema;
