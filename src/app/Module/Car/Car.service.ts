/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { TCar } from "./Car.interface";
import { CarModel } from "./Car.model";
import QueryBuilder from "../../Builder/QueryBuilder";
import { carSearchTerm } from "./Car.const";
import { sendImagesToCloudinary } from "../../Utils/sendImageCloudinary";
import { UserModel } from "../User/User.model";
import { USER_ROLE, USER_STATUS } from "../User/User.const";
import QueryBuilder2 from "../../Builder/QueryBuilder2";
// import { sendImageCloudinary } from "../../Utils/sendImageCloudinary";
// import mongoose from "mongoose";
// import { BookingModel } from "../Booking/Booking.model";
// import { timeToHours } from "./Car.utils";

const crateCarDB = async (payload: TCar, files: any) => {
  const filesPathNames = files.map((item: { path: any }) => item.path);
  const imageUrls = await sendImagesToCloudinary(filesPathNames);
  if (!imageUrls?.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "There is no image file !");
  }
  const newPayload = {
    ...payload,
    images: imageUrls,
  };

  const result = await CarModel.create(newPayload);
  return result;
};
const findOneCarDB = async (id: string, userRole: string) => {
  const result = await CarModel.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "No Data Found !");
  }

  if (userRole !== USER_ROLE.admin) {
    if (result?.isDelete) {
      throw new AppError(404, "This Car Already Deleted !");
    }
  }
  return result;
};

const findAllCarsByAdminOneDB = async (queryParams: Partial<TCar>) => {
  const carQuery = new QueryBuilder(CarModel.find(), queryParams)
    .search(carSearchTerm)
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await carQuery.modelQuery;
  const meta = await carQuery.countTotal();

  return {
    meta,
    result,
  };
};

const findAllCarsByEveryOneDB = async (queryParams: Partial<TCar>) => {
  const carQuery = new QueryBuilder2(
    CarModel.find({ isDelete: false }),
    queryParams
  )
    .search(carSearchTerm)
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await carQuery.modelQuery;
  const meta = await carQuery.countTotal();

  return {
    meta,
    result,
  };
};

const updateCarDB = async (
  id: string,
  payload: Partial<TCar>,
  userId: string,
  files: any
) => {
  const user = await UserModel.findById({ _id: userId }).select(
    "role status isDelete"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found");
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Delete");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Blocked");
  }
  const car = await CarModel.findById(id);
  if (!car) {
    throw new AppError(404, "No Data Found !");
  }
  const previousCarImagesGetsPayload = payload?.images as string[];
  const previousImageByDB = car?.images;

  const newPayload = { ...payload };
  if (files?.length) {
    const filesPathNames = files.map((item: { path: any }) => item.path);
    const imageUrls = await sendImagesToCloudinary(filesPathNames);
    if (imageUrls?.length) {
      if (previousCarImagesGetsPayload) {
        newPayload.images = [...previousCarImagesGetsPayload, ...imageUrls];
      } else if (previousImageByDB) {
        newPayload.images = [...previousImageByDB, ...imageUrls];
      }
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cloudinary Image Hosting problem "
      );
    }
  }

  const result = await CarModel.findByIdAndUpdate(id, newPayload, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  if (result) {
    return result;
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "Car Update failed !");
  }
};
// const deleteCarDB = async (id: string) => {
//   const isExists = await CarModel.findById(id);
//   if (!isExists) {
//     throw new AppError(404, "No Data Found !");
//   }

//   const result = await CarModel.findByIdAndUpdate(
//     id,
//     { isDeleted: true },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   if (result) {
//     return result;
//   } else {
//     throw new AppError(httpStatus.FORBIDDEN, "Car Delete failed !");
//   }
// };

// const carReturnDB = async (payload: Partial<TCarReturn>) => {
//   const { bookingId, endTime } = payload;
//   const session = await mongoose.startSession();
//   const isBookingExists = await BookingModel.findById({
//     _id: bookingId,
//   });
//   if (!isBookingExists) {
//     throw new AppError(404, "Data Not Found !");
//   }
//   const car = await CarModel.findById({ _id: isBookingExists?.car }).select(
//     "pricePerHour"
//   );
//   const carPricePerHour = car?.pricePerHour as number;
//   const bookingStartTime = timeToHours(isBookingExists?.startTime);
//   const bookingEndTime = timeToHours(endTime as string);
//   if (bookingEndTime < bookingStartTime) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `Booking end time (${endTime}) should not be earlier than start time (${isBookingExists?.startTime})`
//     );
//   }
//   try {
//     await session.startTransaction();
//     const carResult = await CarModel.findByIdAndUpdate(
//       { _id: isBookingExists?.car },
//       { status: "available" },
//       { new: true, runValidators: true, upsert: true, session }
//     );
//     if (!carResult) {
//       throw new AppError(httpStatus.BAD_REQUEST, "This Car Data Not Found ");
//     }

//     const calcTotalCost = (bookingEndTime - bookingStartTime) * carPricePerHour;
//     const bookingResult = await BookingModel.findByIdAndUpdate(
//       { _id: bookingId },
//       {
//         endTime: endTime,
//         totalCost: calcTotalCost,
//       },
//       {
//         new: true,
//         runValidators: true,
//         session,
//         upsert: true,
//       }
//     ).populate("car user");
//     if (!bookingResult) {
//       throw new AppError(400, "Booking Update Failed !");
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return bookingResult;
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.FORBIDDEN, "Car Return Failed !");
//   }
// };

export const carService = {
  crateCarDB,
  findOneCarDB,
  findAllCarsByAdminOneDB,
  findAllCarsByEveryOneDB,
  updateCarDB,
  // deleteCarDB,
  // carReturnDB,
};
