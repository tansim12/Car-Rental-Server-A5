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
import { UserModel } from "../User/User.model";
import { USER_STATUS } from "../User/User.const";
import { bookingUserSearchTram } from "./Booking.const";

const createBookingsDB = async (
  payload: Partial<TBookings>,
  userId: string
) => {
  const session = await mongoose.startSession();
  const { carId } = payload;
  const user = await UserModel.findById({ _id: userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Delete");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Blocked");
  }

  try {
    await session.startTransaction();
    const carIsExists: Partial<TCar | null> = await CarModel.findById({
      _id: carId,
    })
      .session(session)
      .select(
        "_id availability isDelete advance availableAreas rentalPricePerDay"
      );

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
    // const otp = Math.floor(10000 + Math.random() * 90000).toString();

    const newPayload = {
      ...payload,
      advancePayment,
      totalCost,
      deuPayment,
      userId: user?._id,
      // otp,
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

const findOneMyBookingsDB = async (
  id: string,
  queryParams: Partial<TBookings>
) => {
  const {  startDate,endDate } = queryParams;
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Delete");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Blocked");
  }

 
  const checkDataFormate = (d: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(new Date(d).getTime());

  if (startDate && !checkDataFormate(startDate!)) {
    throw new AppError(
      400,
      `Date formate should be YYYY-MM-DD . You have ${startDate}`
    );
  }
  if (endDate && !checkDataFormate(endDate!)) {
    throw new AppError(
      400,
      `Date formate should be YYYY-MM-DD . You have ${endDate}`
    );
  }

  const myBookingQuery = new QueryBuilder(
    BookingModel.find({ userId: id }),
    queryParams
  )
    .search(bookingUserSearchTram)
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await myBookingQuery.modelQuery;
  const meta = await myBookingQuery.countTotal();
  if (result.length) {
    return { meta, result };
  } else {
    throw new AppError(404, "Data Not Found !");
  }
};



const findAllBookingsDB = async (
  userId: string,
  queryParams: Partial<TBookings>
) => {
  const newQueryParams: Partial<TBookings> = { ...queryParams };
  const { carId, startDate,endDate } = queryParams;
  const checkDataFormate = (d: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(new Date(d).getTime());

  if (startDate && !checkDataFormate(startDate!)) {
    throw new AppError(
      400,
      `Date formate should be YYYY-MM-DD . You have ${startDate}`
    );
  }
  if (endDate && !checkDataFormate(endDate!)) {
    throw new AppError(
      400,
      `Date formate should be YYYY-MM-DD . You have ${endDate}`
    );
  }
  if (carId) {
    const carIsExists = await CarModel.findById({ _id: carId }).select("isDelete");
    
    if (!carIsExists) {
      throw new AppError(404, "This Car Data Not Found !");
    }
    if (carIsExists?.isDelete) {
      throw new AppError(404, "This Car Already Delete !");
    }
  }

  // console.log(queryParams);
  if (newQueryParams?.carId) {
    newQueryParams.carId = new mongoose.Types.ObjectId(newQueryParams.carId) as
      | mongoose.Types.ObjectId
      | undefined;
  }

  const carQuery = new QueryBuilder(
    BookingModel.find({paymentStatus:1}),
    newQueryParams
  ).filter();
  const result = await carQuery.modelQuery;

  if (result?.length) {
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
