import { Types } from "mongoose";
import { z } from "zod";

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
  },
  {
    message: 'Invalid time format, expected "HH:MM" in 24 hours format',
  }
);

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
const carUpdateValidationSchemaZod = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required").optional(),
    description: z.string().nonempty("Description is required").optional(),
    color: z.string().nonempty("Color is required").optional(),
    isElectric: z
      .boolean()
      .refine((val) => typeof val === "boolean", {
        message: "isElectric must be a boolean",
      })
      .optional(),
    features: z.array(z.string()).nonempty("Features are required").optional(),
    pricePerHour: z
      .number()
      .positive("Price per hour must be a positive number")
      .optional(),
    status: z
      .enum(["available", "unavailable", "maintenance"])
      .default("available")
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

const carReturnSchemaZod = z.object({
  body: z.object({
    bookingId: z.string({
      required_error:"Booking Id Required "
    }).refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid car ID",
    }),
    endTime: timeStringSchema,
  }),
});

export const carZodValidation = {
  carCreateValidationSchemaZod,
  carUpdateValidationSchemaZod,
  carReturnSchemaZod,
};
