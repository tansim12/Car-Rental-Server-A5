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

// Define a Zod schema for the date format (YYYY-MM-DD)
const dateSchema = z.string().refine(
  (date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime()), 
  {
    message: "Invalid date format. Expected format is YYYY-MM-DD",
  }
);

const bookingCreatingValidationSchemaZod = z.object({
  body: z.object({
    carId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid car ID",
    }),
    date:dateSchema

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
