import { Schema, model } from "mongoose";
import { TBookings, TPaymentInfo } from "./Booking.interface";
import { carAvailableAreaArray } from "../Car/Car.const";

const PaymentInfoSchema = new Schema<TPaymentInfo>({
  mer_txnid: { type: String, required: true },
  cus_email: { type: String, required: true },
  cus_phone: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_type: { type: String, required: true },
  approval_code: { type: String, required: true },
});
const bookingSchema = new Schema<TBookings>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    pickupArea: {
      type: String,
      enum: carAvailableAreaArray,
      required: true,
    },
    dropOffArea: {
      type: String,
      enum: carAvailableAreaArray,
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
    rentalPricePerDay: {
      type: Number,
    },
    advancePaymentInfo: {
      type: PaymentInfoSchema,
    },
    deuPaymentInfo: {
      type: PaymentInfoSchema,
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = model<TBookings>("Booking", bookingSchema);
