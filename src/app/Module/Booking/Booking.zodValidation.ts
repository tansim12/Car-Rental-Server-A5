import { z } from "zod";
import { Types } from "mongoose";
import { carAvailableAreaArray } from "../Car/Car.const";

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

const PaymentInfoSchema = z.object({
  mer_txnid: z.string().nonempty({ message: "Transaction ID is required" }),
  cus_email: z.string().nonempty({ message: "Customer name is required" }),
  cus_phone: z.string().nonempty({ message: "Customer phone is required" }),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  payment_type: z.string().nonempty({ message: "Payment type is required" }),
  approval_code: z.string().nonempty({ message: "Approval code is required" }),
});
const pickupAreaSchema = z.enum(
  carAvailableAreaArray as [string, ...string[]],
  {
    errorMap: () => ({ message: "Invalid pickup car Available Area " }),
  }
);
const dropOffAreaSchema = z.enum(
  carAvailableAreaArray as [string, ...string[]],
  {
    errorMap: () => ({ message: "Invalid dropOff car Available Area " }),
  }
);
const bookingCreatingValidationSchemaZod = z.object({
  body: z.object({
    carId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid car ID",
    }),
    pickupArea: pickupAreaSchema,
    dropOffArea: dropOffAreaSchema,
    startDate: dateSchema,
    endDate: dateSchema,
    userId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid User ID",
      })
      .optional(),
    orderCancel: z.boolean().optional(),
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
    adminApprove: z.enum(["0", "1", "2", "3"]).transform(Number).optional(),
    advancePaymentInfo: PaymentInfoSchema.optional(),
    deuPaymentInfo: PaymentInfoSchema.optional(),
  }),
});
const updateBookingZodSchema = z.object({
  body: z.object({
    carId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid car ID",
      })
      .optional(),
      pickupArea: pickupAreaSchema.optional(),
      dropOffArea: dropOffAreaSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    userId: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid User ID",
      })
      .optional(),
    orderCancel: z.boolean().optional(),
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
    // paymentStatus: z.enum(["0", "1", "2"]).transform(Number).optional(),
    paymentStatus: z
      .union([z.literal(0), z.literal(1), z.literal(2)])
      .optional()
      .refine((val) => [0, 1, 2].includes(val!), {
        message: "paymentStatus must be one of the following values: 0, 1, 2.",
      })
      .optional(),
    adminApprove: z
      .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
      .optional()
      .refine((val) => [0, 1, 2, 3].includes(val!), {
        message:
          "adminApprove must be one of the following values: 0, 1, 2, 3.",
      })
      .optional(),
    advancePaymentInfo: PaymentInfoSchema.optional(),
    deuPaymentInfo: PaymentInfoSchema.optional(),
  }),
});

export const bookingZodValidation = {
  bookingCreatingValidationSchemaZod,
  updateBookingZodSchema,
};
