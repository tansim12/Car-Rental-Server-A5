import { z } from "zod";

const signInValidationSchemaZod = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: "Email must be a valid email" })
      .nonempty({ message: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const authZodValidation = {
    signInValidationSchemaZod,
};
