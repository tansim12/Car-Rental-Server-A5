import { RequestHandler } from "express";
import { carService } from "./Car.service";
import { successResponse } from "../../Re-Useable/CustomResponse";

const crateCar: RequestHandler = async (req, res, next) => {
  try {
    const result = await carService.crateCarDB(req.body);
    res.status(201).send(successResponse(result, "Car created successfully"));
  } catch (error) {
    next(error);
  }
};

export const carController = {
  crateCar,
};
