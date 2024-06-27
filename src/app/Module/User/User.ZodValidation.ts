import { z } from "zod";

const userCreateValidationSchemaZod = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    email: z
      .string()
      .email({ message: "Email must be a valid email" })
      .nonempty({ message: "Email is required" }),
    role: z.enum(["user", "admin"], { required_error: "Role is required" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
      .nonempty("Password is required"),
    phone: z.string().nonempty("Phone number is required"),
    address: z.string().nonempty("Address is required"),
  }),
});

export const UserZodValidation = {
  userCreateValidationSchemaZod,
};
