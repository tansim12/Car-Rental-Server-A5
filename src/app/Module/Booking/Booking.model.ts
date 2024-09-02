import { Schema, model } from "mongoose";
import { TBookings } from "./Booking.interface";

const bookingSchema = new Schema<TBookings>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderCancel: {
      type: Boolean,
      default: false,
    },
    totalCost: {
      type: Number,
    },
    advancePayment: {
      type: Number,
    },
    deuPayment: {
      type: Number,
    },
    otp: {
      type: String,
    },
    paymentStatus: {
      type: Number,
      default: 0,
    },
    adminApprove: {
      type: Number,
      default: 0,
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

export const BookingModel = model<TBookings>("Booking", bookingSchema);
