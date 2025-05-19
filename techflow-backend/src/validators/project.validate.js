import { z } from "zod";

const projectSchema = z.object({
  title: z
    .string({
      required_error: "Title is Required",
      invalid_type_error: "Title must be of type String",
    })
    .trim()
    .min(5, { message: "Title is too short" }),
  description: z
    .string({
      required_error: "Description of the Project is required",
      invalid_type_error: "Description must of type String",
    })
    .min(10, { message: "Description is too short" }),
  owner: z.string({
    required_error: "Owner is required",
    invalid_type_error: "Invalid Id Format",
  }),
  status: z.enum(["Active", "On-Hold", "Completed"]).default("Active"),
  dueDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
      z.date()
    )
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
  members: z.array(z.string({ invalid_type_error: "Invalid Id Format" })),
});

export default { projectSchema };
