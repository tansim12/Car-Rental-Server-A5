// import { Types } from "mongoose";
import { z } from "zod";
import { carAvailabilityArray, carAvailableAreaArray, carCategoryArray, carTypeArray } from "./Car.const";

// const timeStringSchema = z.string().refine(
//   (time) => {
//     const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
//     return regex.test(time);
//   },
//   {
//     message: 'Invalid time format, expected "HH:MM" in 24 hours format',
//   }
// );

const TCarCategory = z.enum(carCategoryArray as [string, ...string[]], {
  errorMap: () => ({ message: "Invalid car category" }),
});
const TCarType = z.enum(carTypeArray as [string, ...string[]], {
  errorMap: () => ({ message: "Invalid car type" }),
});

const TAvailableArea = z.enum(carAvailableAreaArray as [string, ...string[]], {
  errorMap: () => ({ message: "Invalid available area" }),
});

const FaqSchema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  answer: z.string().min(1, { message: "Answer is required" }),
});

const createCarZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    category: TCarCategory,
    brand: z.string().min(1, { message: "Brand is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    type: TCarType,
    model: z.string().min(1, { message: "Model is required" }),
    VIN: z.string().min(1, { message: "VIN is required" }),
    licensePlate: z.string().min(1, { message: "License plate is required" }),
    color: z.string().min(1, { message: "Color is required" }),
    mileage: z
      .number()
      .min(0, { message: "Mileage must be a non-negative number" }),
    rentalPricePerDay: z
      .number()
      .min(0, {
        message: "Rental price per day must be a non-negative number",
      }),
    advance: z
      .number()
      .min(0, { message: "Advance must be a non-negative number" }),
    availability: z.enum(carAvailabilityArray as [string, ...string[]], {
      errorMap: () => ({ message: "Invalid availability status" }),
    }),
    availableAreas: z.array(TAvailableArea, {
      errorMap: () => ({ message: "Each area must be a valid available area" }),
    }),
    numberOfDoors: z
      .number()
      .min(1, { message: "Number of doors must be at least 1" }),
    seatingCapacity: z
      .number()
      .min(1, { message: "Seating capacity must be at least 1" }),
    features: z.array(z.string().min(1), {
      errorMap: () => ({ message: "Each feature must be a non-empty string" }),
    }),
    safetyFeatures: z.array(z.string().min(1), {
      errorMap: () => ({
        message: "Each safety feature must be a non-empty string",
      }),
    }),
    faqs: z.array(FaqSchema, {
      errorMap: () => ({
        message: "Each FAQ must have a valid question and answer",
      }),
    }),
    isDelete: z.boolean().optional(),
  }),
});

export const carZodValidation = {
  createCarZodSchema,
};
