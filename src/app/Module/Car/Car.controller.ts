import { RequestHandler } from "express";
import { carService } from "./Car.service";
import { successResponse } from "../../Re-Useable/CustomResponse";

const crateCar: RequestHandler = async (req, res, next) => {
  try {
    const result = await carService.crateCarDB(req.body);
    res.send(successResponse(result, 201, "Car created successfully"));
  } catch (error) {
    next(error);
  }
};
const findOneCar: RequestHandler = async (req, res, next) => {
  try {
    const result = await carService.findOneCarDB(req.params.id);
    res.send(successResponse(result, 200, "A Car retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
const findAllCars: RequestHandler = async (req, res, next) => {
  try {
    const result = await carService.findAllCarsDB();
    res.send(successResponse(result, 200, "Cars retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const carController = {
  crateCar,
  findAllCars,
  findOneCar,
};
