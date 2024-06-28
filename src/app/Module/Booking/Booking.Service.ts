import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { CarModel } from "../Car/Car.model";
import { TBookings } from "./Booking.interface";
import mongoose from "mongoose";
import { BookingModel } from "./Booking.model";
import QueryBuilder from "../../Builder/QueryBuilder";

const createBookingsDB = async (
  payload: Partial<TBookings>,
  userId: string
) => {
  const session = await mongoose.startSession();
  const { carId } = payload;
  const carIsExists = await CarModel.findById({ _id: carId });
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
      { _id: carId },
      { status: "unavailable" },
      { new: true, session }
    );

    if (!updateCar) {
      throw new AppError(httpStatus.BAD_REQUEST, "Car status Updated failed !");
    }

    const newPayload = {
      date: payload?.date,
      car: payload.carId,
      startTime: payload?.startTime,
      user: userId,
    };

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

const findAllBookingsDB = async (queryParams: Partial<TBookings>) => {
  const { carId, date } = queryParams;
  const newQueryParams: Partial<TBookings> = { ...queryParams };
  const checkDataFormate = (d: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(new Date(d).getTime());

  if (date && !checkDataFormate(date)) {
    throw new AppError(
      400,
      `Date formate should be YYYY-MM-DD . You have ${date}`
    );
  }
  if (carId) {
    const carIsExists = await CarModel.findById({ _id: carId });
    if (!carIsExists) {
      throw new AppError(404, "Data Not Found !");
    }
  }

  // console.log(queryParams);
  if (newQueryParams?.carId) {
    newQueryParams.car = new mongoose.Types.ObjectId(newQueryParams.carId) as
      | mongoose.Types.ObjectId
      | undefined;
    delete newQueryParams?.carId;
  }

  const carQuery = new QueryBuilder(
    BookingModel.find().populate("car user"),
    newQueryParams
  ).filter();
  const result = await carQuery.modelQuery;

  if (result?.length) {
    return result;
  } else {
    throw new AppError(404, "Data Not Found !");
  }
};

const findOneMyBookingsDB = async (id: string) => {
  const result = await BookingModel.find({ id }).populate("user car");
  return result;
};

export const bookingsService = {
  createBookingsDB,
  findAllBookingsDB,
  findOneMyBookingsDB,
};
