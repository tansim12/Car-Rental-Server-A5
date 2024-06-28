import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { CarModel } from "../Car/Car.model";
import { TBookings } from "./Booking.interface";
import mongoose from "mongoose";
import { BookingModel } from "./Booking.model";

const createBookingsDB = async (
  payload: Partial<TBookings>,
  userId: string
) => {
  const session = await mongoose.startSession();
  const { car } = payload;
  const carIsExists = await CarModel.findById({ _id: car });
  if (!carIsExists) {
    throw new AppError(404, "Data Not Found !");
  }

  const isAvailable = carIsExists?.status;
  const carIsDeleted = carIsExists.isDeleted;
  if (isAvailable !== "available") {
    throw new AppError(httpStatus.BAD_REQUEST, "This Car Not Available !");
  }
  if (carIsDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Car Already Deleted !");
  }

  try {
    await session.startTransaction();
    const updateCar = await CarModel.findByIdAndUpdate(
      { _id: car },
      { status: "unavailable" },
      { new: true, session }
    );

    if (!updateCar) {
      throw new AppError(httpStatus.BAD_REQUEST, "Car status Updated failed !");
    }

    const newPayload = { ...payload, user: userId };
    const bookingResult = await BookingModel.create([newPayload], { session });
    if (!bookingResult.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Booking failed !");
    }
    const result = await BookingModel.findById(bookingResult[0]._id)
      .populate("car user")
      .session(session);
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Booking failed2 !");
  }
};

export const bookingsService = {
  createBookingsDB,
};
