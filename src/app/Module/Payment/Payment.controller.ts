import { RequestHandler } from "express";
import { paymentService } from "./Payment.service";
import { successResponse } from "../../Re-Useable/CustomResponse";

const payment: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.paymentDB(req.body, req.user?.id);
    res.send(successResponse(result, 200, "Car booked successfully"));
  } catch (error) {
    next(error);
  }
};
const callback: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.callbackDB(req.body);
    res.send(successResponse(result, 200, "Callback"));
  } catch (error) {
    next(error);
  }
};



export const paymentController = {
  payment,callback
};
