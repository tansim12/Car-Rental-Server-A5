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
    const result = await bookingsService.findAllBookingsDB(
      req.user?.id,
      req.query
    );
    res.send(successResponse(result, 200, "Bookings retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
const findOneMyBookings: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.findOneMyBookingsDB(
      req.user?.id,
      req.query
    );
    res.send(
      successResponse(result, 200, "My Bookings retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};
const userBookingSchedule: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.userBookingScheduleDB(req.user?.id);
    res.send(
      successResponse(result, 200, "My Bookings Booking Schedule successfully")
    );
  } catch (error) {
    next(error);
  }
};

const adminReturnCarSchedule: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.adminReturnCarScheduleDB(req.user?.id);
    res.send(
      successResponse(result, 200, " Booking Returned Schedule successfully")
    );
  } catch (error) {
    next(error);
  }
};
const adminDashboardAggregate: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.adminDashboardAggregateDB(
      req.user?.id
    );
    res.send(successResponse(result, 200, " successfully"));
  } catch (error) {
    next(error);
  }
};
const updateBooking: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.updateBookingDB(
      req?.body,
      req?.params?.bookingId,
      req.user?.id
    );
    res.send(
      successResponse(result, 200, "My Bookings retrieved successfully")
    );
  } catch (error) {
    next(error);
  }
};
const monthRevenue: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.monthRevenueDB();
    res.send(successResponse(result, 200, "Monthly revenue"));
  } catch (error) {
    next(error);
  }
};
const userMonthlyCost: RequestHandler = async (req, res, next) => {
  try {
    const result = await bookingsService.userMonthlyCostDB(req?.user?.id);
    res.send(successResponse(result, 200, "user Monthly revenue"));
  } catch (error) {
    next(error);
  }
};

export const bookingsController = {
  createBookings,
  findAllBookings,
  findOneMyBookings,
  updateBooking,
  userBookingSchedule,
  adminReturnCarSchedule,
  adminDashboardAggregate,
  monthRevenue,
  userMonthlyCost,
};
