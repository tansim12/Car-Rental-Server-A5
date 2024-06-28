import { RequestHandler } from "express";
import { bookingsService } from "./Booking.Service";
import { successResponse } from "../../Re-Useable/CustomResponse";

const createBookings: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.createBookingsDB(
      req.body,
      req.user?.id
    );
    res.send(successResponse(result, 200, "Car booked successfully"));
  } catch (error) {
    next(error);
  }
};
const findAllBookings: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.findAllBookingsDB(req.query);
    res.send(successResponse(result, 200, "Bookings retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
const findOneMyBookings: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.findOneMyBookingsDB(req.user?.id);
    res.send(
      successResponse(result, 200, "My Bookings retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};
export const bookingsController = {
  createBookings,
  findAllBookings,
  findOneMyBookings,
};
