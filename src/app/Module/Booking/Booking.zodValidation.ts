import { z } from "zod";
import { Types } from "mongoose";

// const timeStringSchema = z.string().refine(
//   (time) => {
//     const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
//     return regex.test(time);
//   },
//   {
//     message: 'Invalid time format, expected "HH:MM" in 24 hours format',
//   }
// );

// Define a Zod schema for the date format (YYYY-MM-DD)
const dateSchema = z
  .string()
  .refine(
    (date) =>
      /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime()),
    {
      message: "Invalid date format. Expected format is YYYY-MM-DD",
    }
  );

const bookingCreatingValidationSchemaZod = z.object({
  body: z.object({
    carId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid car ID",
    }),

    startDate: dateSchema,
    endDate: dateSchema,
    userId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid User ID",
    }),
    advancePayment: z
      .number()
      .nonnegative({
        message: "Advance payment must be a non-negative number.",
      })
      .optional(),
    totalCost: z
      .number()
      .nonnegative({
        message: "Total cost must be a non-negative number.",
      })
      .optional(),
    deuPayment: z
      .number()
      .nonnegative({
        message: "Due payment must be a non-negative number.",
      })
      .optional(),
    otp: z
      .string()
      .min(6, { message: "OTP must be at least 6 characters long." })
      .optional(),
    paymentStatus: z.enum(["0", "1", "2"]).transform(Number).optional(),
  }),
});

export const bookingZodValidation = {
  bookingCreatingValidationSchemaZod,
};
