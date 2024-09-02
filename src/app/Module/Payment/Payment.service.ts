import axios from "axios";
import dotenv from "dotenv";
import { UserModel } from "../User/User.model";
import AppError from "../../Error-Handle/AppError";
import httpStatus from "http-status";
import { USER_STATUS } from "../User/User.const";
import { BookingModel } from "../Booking/Booking.model";
import { CARAVAILABLE } from "../Car/Car.const";
dotenv.config();
import { v7 as uuidv7 } from "uuid";

type TCarId =
  | {
      isDelete: boolean;
      availability: string;
      rentalPricePerDay: number;
    }
  | undefined;

const paymentDB = async (body: any, userId: string) => {
  const { bookingId, isAdvancePayment } = body;
  const user = await UserModel.findById({ _id: userId }).select(
    "name email phone isDelete status"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  }

  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  }

  if (user.status === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  }

  const booking = await BookingModel.findById({ _id: bookingId }).populate({
    path: "carId",
    select: "isDelete availability rentalPricePerDay",
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Car Not found !");
  }
  if (booking.isDelete) {
    throw new AppError(httpStatus.NOT_FOUND, "This Booking Already Delete !");
  }

  const carData: TCarId =
    typeof booking?.carId === "object" &&
    booking.carId !== null &&
    "isDelete" in booking.carId &&
    "availability" in booking.carId &&
    "rentalPricePerDay" in booking.carId
      ? (booking.carId as TCarId)
      : undefined;

  console.log(carData);

  if (carData) {
    if (carData?.availability === CARAVAILABLE.unavailable) {
      throw new AppError(httpStatus.BAD_REQUEST, "Car Is Unavailable Now !");
    }
    if (carData?.isDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, "This Car Already Delete ! !");
    }
  }

  if (carData?.rentalPricePerDay !== booking?.rentalPricePerDay) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Booking Too Old , please select Latest Car.Car Price Updated "
    );
  }
  const transactionId = uuidv7(); // Generate a UUID
  const currentTime = new Date().toISOString(); // or use Date.now() for a timestamp in milliseconds

  // Concatenate UUID with current time
  const combinedTransactionId = `${transactionId}-${currentTime}`;
  const formData = {
    cus_name: `${user?.name ? user?.name : "N/A"}`,
    cus_email: `${user?.email ? user?.email : "N/A"}`,
    cus_phone: `${user?.phone ? user?.phone : "N/A"}`,
    amount: isAdvancePayment ? booking?.advancePayment : booking?.deuPayment,
    tran_id: combinedTransactionId,
    signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
    // store_id: process.env.AAMAR_PAY_STORE_ID,
    store_id: "aamarpaytest",
    currency: "BDT",
    desc: combinedTransactionId,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_country: "Bangladesh",
    success_url: `${process.env.BASE_URL}api/payment/callback`,
    fail_url: `${process.env.BASE_URL}api/payment/callback`,
    cancel_url: `http://localhost:5173/`, // its redirect to frontend directly
    type: "json", //This is must required for JSON request
  };

  const { data } = await axios.post(
    `${process.env.AAMAR_PAY_HIT_API}`,
    formData
  );

  if (data.result !== "true") {
    let errorMessage = "";
    for (const key in data) {
      errorMessage += data[key] + ". ";
    }
    return errorMessage;
  }
  return {
    url: data.payment_url,
  };
};

const callbackDB = async (body: any) => {
  console.log(body);
};

export const paymentService = {
  paymentDB,
  callbackDB,
};
