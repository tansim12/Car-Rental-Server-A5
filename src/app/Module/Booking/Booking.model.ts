import { Schema, model } from "mongoose";
import { TBookings } from "./Booking.interface";

const bookingSchema = new Schema<TBookings>(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    totalCost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = model<TBookings>("Booking", bookingSchema);
