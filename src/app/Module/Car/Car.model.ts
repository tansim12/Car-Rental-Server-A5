import { Schema, model } from "mongoose";
import { TAvailableArea, TCar } from "./Car.interface";
import {
  carAvailabilityArray,
  carCategoryArray,
  carTypeArray,
} from "./Car.const";

const carSchema = new Schema<TCar>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: carCategoryArray,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: carTypeArray,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    VIN: {
      type: String,
      required: true,
      unique: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    color: {
      type: String,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    rentalPricePerDay: {
      type: Number,
      required: true,
    },
    advance: {
      type: Number,
      required: true,
    },
    availability: {
      type: String,
      enum: carAvailabilityArray,
      required: true,
    },
    availableAreas: {
      type: [String],
      enum: Object.values(TAvailableArea),
      required: true,
    },
    numberOfDoors: {
      type: Number,
      required: true,
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    safetyFeatures: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    faqs: {
      type: [
        {
          question: String,
          answer: String,
        },
      ],
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CarModel = model<TCar>("Car", carSchema);
