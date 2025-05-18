import { z } from "zod";

const registrationSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "Name is too short" })
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email format" })
    .trim()
    .toLowerCase(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be string",
    })
    .min(6, { message: "Password is too short" }),
  role: z.enum(["Admin", "Developer", "Tester"]).default("Developer"),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email Format" })
    .trim()
    .toLowerCase(),
  password: z
    .string({
      message: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password is too short" }),
});

export default { loginSchema, registrationSchema };
