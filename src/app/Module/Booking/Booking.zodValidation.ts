import { z } from "zod";
import { Types } from "mongoose";

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
  },
  {
    message: 'Invalid time format, expected "HH:MM" in 24 hours format',
  }
);

const bookingCreatingValidationSchemaZod = z.object({
  body: z.object({
    car: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid car ID",
    }),
    date: z
      .string({
        required_error: "Date is required",
        invalid_type_error: "Date Should Be String",
      })

      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),
    startTime: timeStringSchema,
    // endTime: z.string().nullable(),
    // user: z.string().nonempty("User is required"),
    // totalCost: z.number().nonnegative("Total cost must be a non-negative number"),
  }),
});

export const bookingZodValidation = {
  bookingCreatingValidationSchemaZod,
};
