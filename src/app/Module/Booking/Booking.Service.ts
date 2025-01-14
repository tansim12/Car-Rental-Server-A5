/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { USER_ROLE, USER_STATUS } from "../User/User.const";
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
      rentalPricePerDay: perDay,
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
  const { startDate, endDate } = queryParams;
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
    BookingModel.find({ userId: id }).populate({
      path: "carId",
      select: "name images availability",
    }),
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
  const { carId, startDate, endDate } = queryParams;
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
    const carIsExists = await CarModel.findById({ _id: carId }).select(
      "isDelete"
    );

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
    BookingModel.find({ $or: [{ paymentStatus: 1 }, { paymentStatus: 2 }] })
      .populate({
        path: "userId",
        select: "email",
      })
      .populate({
        path: "carId",
        select: "name images availability",
      }),
    newQueryParams
  )
    .filter()
    .fields()
    .paginate()
    .sort()
    .search(bookingUserSearchTram);
  const result = await carQuery.modelQuery;
  const meta = await carQuery.countTotal();

  if (result?.length) {
    return { meta, result };
  } else {
    throw new AppError(404, "Data Not Found !");
  }
};

const updateBookingDB = async (
  body: Partial<TBookings>,
  id: string,
  userId: string
) => {
  const booking = await BookingModel.findById(id);
  const user = await UserModel.findById({ _id: userId });
  const { startDate, endDate, orderCancel, dropOffArea, pickupArea } = body;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Delete");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Blocked");
  }

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking Data Not Found");
  }

  // when user role is user then check this conditions
  if (user?.role === USER_ROLE.user) {
    if (booking?.isDelete) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking is deleted");
    }
    if (booking?.orderCancel) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking is Canceled");
    }
    if (booking.adminApprove !== 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Admin Already Approved. You can't change it"
      );
    }

    // Check if the payment has already been made
    if (booking.paymentStatus !== 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment already completed. You can't change it"
      );
    }

    if (
      (startDate && endDate) ||
      orderCancel === true ||
      orderCancel === false ||
      dropOffArea ||
      pickupArea
    ) {
      const car = await CarModel.findById({ _id: booking?.carId });
      const advancePayment = car?.advance as number;
      const perDay = car?.rentalPricePerDay;
      const totalDays = calculateDaysDifference(
        body?.startDate as string,
        body?.endDate as string
      );
      if (totalDays === 404) {
        throw new AppError(400, "Start date cannot be later than end date. ");
      }
      const totalCost = (perDay as number) * totalDays;
      const deuPayment = totalCost - advancePayment;
      let payload = { ...body };
      if (startDate && endDate) {
        // If the condition is true, add the properties 'deuPayment', 'totalCost', and 'rentalPricePerDay' to the 'payload'.
        payload = {
          ...payload,
          deuPayment, // Adds 'deuPayment' property.
          totalCost, // Adds 'totalCost' property.
          rentalPricePerDay: perDay, // Adds 'rentalPricePerDay' property with value from 'perDay'.
        };
      }

      if ((startDate && !endDate) || (!startDate && endDate)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Please Select StartDate and EndDate"
        );
      }
      const result = await BookingModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: { ...payload },
        },
        { new: true, upsert: true }
      ).select(
        "_id startDate endDate deuPayment rentalPricePerDay advancePayment orderCancel totalCost dropOffArea pickupArea"
      );
      return result;
    } else {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "You can change start date, end date,orderCancel,pickupArea,dropOffArea "
      );
    }
  }

  if (user?.role === USER_ROLE.admin) {
    const car = await CarModel.findById({ _id: booking?.carId }).select(
      "isDelete availability _id"
    );
    if (!car) {
      throw new AppError(httpStatus.BAD_REQUEST, "This Car Data Not Found !");
    }
    if (car?.isDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, "This Car Already Delete !");
    }
    if (body?.adminApprove === 1) {
      const carUpdateResult = await CarModel.findByIdAndUpdate(
        { _id: car?._id },
        { availability: CARAVAILABLE.unavailable },
        {
          new: true,
          runValidators: true,
        }
      ).select("_id");
      if (!carUpdateResult) {
        throw new AppError(
          httpStatus.CONFLICT,
          "Admin Status 1 but car is not update unavailable"
        );
      }
      const result = await BookingModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: { ...body },
        },
        { new: true, upsert: true }
      );
      if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking Update Failed");
      }
      return result;
    }
    if (body?.adminApprove === 2) {
      const carUpdateResult = await CarModel.findByIdAndUpdate(
        { _id: car?._id },
        { availability: CARAVAILABLE.available },
        {
          new: true,
          runValidators: true,
        }
      ).select("_id");
      if (!carUpdateResult) {
        throw new AppError(
          httpStatus.CONFLICT,
          "Admin Status 2 but car is not update available"
        );
      }
      const result = await BookingModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: { ...body },
        },
        { new: true, upsert: true }
      );
      if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking Update Failed");
      }
      return result;
    }
    // admin cancel the booking order
    if (body?.adminApprove === 3) {
      const carUpdateResult = await CarModel.findByIdAndUpdate(
        { _id: car?._id },
        {
          $set: { ...body },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("_id");
      if (!carUpdateResult) {
        throw new AppError(
          httpStatus.CONFLICT,
          "Admin Status 2 but car is not update available"
        );
      }
      const result = await BookingModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: { ...body },
        },
        { new: true, upsert: true }
      );
      if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking Update Failed");
      }
      return result;
    }
    // admin cancel the booking order
    if (body?.isDelete || body?.isDelete === false) {
      const result = await BookingModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: { ...body },
        },
        { new: true, upsert: true }
      );
      if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking Update Failed");
      }
      return result;
    }
  }
};

const userBookingScheduleDB = async (tokenUserId: string) => {
  const user = await UserModel.findById({ _id: tokenUserId }).select(
    "+password"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Delete");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Blocked");
  }
  const findPaidBooking: any = await BookingModel.find({
    userId: user?.id,
    $or: [{ adminApprove: 1 }, { adminApprove: 2 }],
  })
    .populate({
      path: "carId",
      select: "name",
    })
    .select("adminApprove startDate endDate dropOffArea pickupArea");
  if (!findPaidBooking?.length) {
    return [];
  }

  const result = findPaidBooking.map(
    (event: {
      carId: { name: any };
      startDate: string | number | Date;
      endDate: string | number | Date;
      dropOffArea: string;
      pickupArea: string;
    }) => ({
      title: `${event?.carId?.name} ${event?.pickupArea} To ${event?.dropOffArea}`,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
    })
  );

  return result;
};

const adminReturnCarScheduleDB = async (tokenUserId: string) => {
  const user = await UserModel.findById({ _id: tokenUserId }).select(
    "+password"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found");
  }
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Not Found");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Delete");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Blocked");
  }
  const findPaidBooking: any = await BookingModel.find({
    $or: [{ adminApprove: 1 }, { adminApprove: 2 }],
  })
    .populate({
      path: "userId",
      select: "email",
    })
    .select("startDate endDate dropOffArea pickupArea");
  if (!findPaidBooking?.length) {
    return [];
  }

  const result = findPaidBooking.map(
    (event: {
      userId: {
        [x: string]: any;
        name: any;
      };
      endDate: string | number | Date;
      dropOffArea: string;
      pickupArea: string;
    }) => ({
      title: `${event?.userId?.email} ${event?.pickupArea} To ${event?.dropOffArea}`,
      end: new Date(event.endDate),
    })
  );

  return result;
};
const adminDashboardAggregateDB = async (tokenUserId: string) => {
  const user = await UserModel.findById({ _id: tokenUserId }).select(
    "+password"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found");
  }
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Not Found");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Deleted");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User is Already Blocked");
  }

  // Get admin-approved bookings aggregation
  const adminApproveBookings = await BookingModel.aggregate([
    {
      $match: { adminApprove: 2 }, // Match bookings where adminApprove is 2
    },
    {
      $group: {
        _id: null, // Group all documents into one result
        totalBooking: { $sum: 1 }, // Count the total number of bookings
        totalCost: { $sum: "$totalCost" }, // Sum the total cost of all bookings
      },
    },
  ]);

  // Get available and unavailable cars aggregation
  const carAvailable = await CarModel.aggregate([
    {
      $match: { availability: { $in: ["available", "unavailable"] } }, // Match cars with 'available' or 'unavailable'
    },
    {
      $group: {
        _id: null,
        totalCarAvailable: {
          $sum: { $cond: [{ $eq: ["$availability", "available"] }, 1, 0] }, // Sum available cars
        },
        totalCarUnavailable: {
          $sum: { $cond: [{ $eq: ["$availability", "unavailable"] }, 1, 0] }, // Sum unavailable cars
        },
      },
    },
  ]);

  // Handle empty results from aggregation
  const bookingsData =
    adminApproveBookings.length > 0
      ? adminApproveBookings[0]
      : { totalBooking: 0, totalCost: 0 };

  const carsData =
    carAvailable.length > 0
      ? carAvailable[0]
      : { totalCarAvailable: 0, totalCarUnavailable: 0 };

  // Return merged data
  return {
    totalBooking: bookingsData.totalBooking,
    totalCost: bookingsData.totalCost,
    totalCarAvailable: carsData.totalCarAvailable,
    totalCarUnavailable: carsData.totalCarUnavailable,
  };
};

const months = [
  { month: "January", order: 1 },
  { month: "February", order: 2 },
  { month: "March", order: 3 },
  { month: "April", order: 4 },
  { month: "May", order: 5 },
  { month: "June", order: 6 },
  { month: "July", order: 7 },
  { month: "August", order: 8 },
  { month: "September", order: 9 },
  { month: "October", order: 10 },
  { month: "November", order: 11 },
  { month: "December", order: 12 },
];

const monthRevenueDB = async () => {
  const revenueByMonth = await BookingModel.aggregate([
    {
      $match: {
        adminApprove: 2, // Filter documents where adminApprove is 2
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" }, // Group by month
        revenue: { $sum: "$totalCost" }, // Sum the revenue
      },
    },
    {
      $project: {
        _id: 0,
        monthNumber: "$_id", // Keep month number
        revenue: 1, // Include revenue
      },
    },
  ]);

  // Combine with all months
  const completeRevenueByMonth = months.map((month) => {
    const found = revenueByMonth.find(
      (item) => item.monthNumber === month.order
    );
    return {
      month: month.month,
      revenue: found ? found.revenue : 0, // Use found revenue or default to 0
    };
  });

  return completeRevenueByMonth;
};
const userMonthlyCostDB = async (id: string) => {
  const isExistUser = await UserModel.findById(id);
  if (!isExistUser?._id || isExistUser?.isDelete === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user not exist");
  }
  const revenueByMonth = await BookingModel.aggregate([
    {
      $match: {
        userId: isExistUser?._id,
        adminApprove: 2, // Filter documents where adminApprove is 2
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" }, // Group by month
        revenue: { $sum: "$totalCost" }, // Sum the revenue
      },
    },
    {
      $project: {
        _id: 0,
        monthNumber: "$_id", // Keep month number
        revenue: 1, // Include revenue
      },
    },
  ]);

  // Combine with all months
  const completeRevenueByMonth = months.map((month) => {
    const found = revenueByMonth.find(
      (item) => item.monthNumber === month.order
    );
    return {
      month: month.month,
      revenue: found ? found.revenue : 0, // Use found revenue or default to 0
    };
  });

  return completeRevenueByMonth;
};
const userPaymentStatusDataDB = async (id: string) => {
  const isExistUser = await UserModel.findById(id);
  if (!isExistUser?._id || isExistUser?.isDelete === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user not exist");
  }

  const paymentStatusData = await BookingModel.aggregate([
    {
      $match: {
        userId: isExistUser?._id,
      },
    },
    {
      $group: {
        _id: "$paymentStatus", // Group by paymentStatus
        count: { $sum: 1 },    // Count the number of documents
      },
    },
    {
      $project: {
        _id: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", 0] }, then: "Pending" },
              { case: { $eq: ["$_id", 1] }, then: "Advance" },
              { case: { $eq: ["$_id", 2] }, then: "Complete" },
            ],
            default: "Unknown", // Default case if the paymentStatus is not 0, 1, or 2
          },
        },
        count: 1,
      },
    },
    {
      $sort: { count: -1 }, // Optional: Sort by count in descending order
    },
  ]);

  // Create an array of objects with default 0 values
  const result = [
    { name: "Pending", value: 0 },
    { name: "Advance", value: 0 },
    { name: "Complete", value: 0 },
  ];

  // Update the result array with the data from the aggregation if available
  paymentStatusData.forEach((item) => {
    if (item._id === "Pending") result[0].value = item.count;
    if (item._id === "Advance") result[1].value = item.count;
    if (item._id === "Complete") result[2].value = item.count;
  });

  return result;
};


export const bookingsService = {
  createBookingsDB,
  findAllBookingsDB,
  findOneMyBookingsDB,
  updateBookingDB,
  userBookingScheduleDB,
  adminReturnCarScheduleDB,
  adminDashboardAggregateDB,
  monthRevenueDB,
  userMonthlyCostDB,
  userPaymentStatusDataDB,
};
