import { z } from "zod";

const carCreateValidationSchemaZod = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    color: z.string().nonempty("Color is required"),
    isElectric: z.boolean().refine((val) => typeof val === "boolean", {
      message: "isElectric must be a boolean",
    }),
    features: z.array(z.string()).nonempty("Features are required"),
    pricePerHour: z
      .number()
      .positive("Price per hour must be a positive number"),
    status: z
      .enum(["available", "unavailable", "maintenance"])
      .default("available"),
    isDeleted: z.boolean().default(false),
  }),
});

export const carZodValidation = {
  carCreateValidationSchemaZod,
};
