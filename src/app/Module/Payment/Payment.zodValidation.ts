import { Types } from "mongoose";
import { z } from "zod";

const paymentZodSchema = z.object({
  body: z.object({
    bookingId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid Booking ID",
    }),
    isAdvancePayment: z.boolean().refine((val) => typeof val === "boolean", {
      message: "isAdvancePayment must be a boolean",
    }),
  }),
});

export const paymentZodValidation = {
  paymentZodSchema,
};
