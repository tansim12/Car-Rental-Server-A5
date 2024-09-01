import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { CarModel } from "../Car/Car.model";
import { TBookings } from "./Booking.interface";
import mongoose from "mongoose";
import { BookingModel } from "./Booking.model";
import QueryBuilder from "../../Builder/QueryBuilder";
import { CARAVAILABLE } from "../Car/Car.const";
import { TCar } from "../Car/Car.interface";
import { calculateDaysDifference } from "../../Utils/calculateDaysDifference";

const createBookingsDB = async (
  payload: Partial<TBookings>,
  userId: string
) => {
  const session = await mongoose.startSession();
  const { carId } = payload;

  try {
    await session.startTransaction();

    const carIsExists: Partial<TCar | null> = await CarModel.findById({
      _id: carId,
    });
    if (!carIsExists) {
      throw new AppError(404, "Data Not Found !");
    }
    const isAvailable = carIsExists?.availability;
    const carIsDeleted = carIsExists.isDelete;
    if (isAvailable !== CARAVAILABLE.available) {
      throw new AppError(httpStatus.BAD_REQUEST, "This Car Not Available !");
    }
    if (carIsDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "This Car Already Deleted !");
    }
    const advancePayment = carIsExists?.advance as number;
    const perDay = carIsExists?.rentalPricePerDay;
    const totalDays = calculateDaysDifference(
      payload?.startDate as string,
      payload?.endDate as string
    );
    if (totalDays === 404) {
      throw new AppError(400, "Start date cannot be later than end date. ");
    }

    const totalCost = (perDay as number) * totalDays;
    const deuPayment = totalCost - advancePayment;
    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    const newPayload = {
      ...payload,
      advancePayment,
      totalCost,
      deuPayment,
      otp,
    };

    const bookingResult = await BookingModel.create([newPayload], { session });
    if (!bookingResult.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Booking failed !");
    }
    const result = await BookingModel.findById({
      _id: bookingResult[0]._id,
    }).session(session);
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
  const result = await BookingModel.find({ user: id }).populate("user car");
  if (result.length) {
    return result;
  } else {
    throw new AppError(404, "Data Not Found !");
  }
};

export const bookingsService = {
  createBookingsDB,
  findAllBookingsDB,
  findOneMyBookingsDB,
};
