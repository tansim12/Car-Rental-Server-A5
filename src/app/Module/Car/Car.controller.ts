import { RequestHandler } from "express";
import { carService } from "./Car.service";
import { successResponse } from "../../Re-Useable/CustomResponse";

const createCar: RequestHandler = async (req, res, next) => {
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
const findAllCarsByAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await carService.findAllCarsByAdminOneDB(req?.query);
    res.send(successResponse(result, 200, "Cars retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
const findAllCarsByEveryOne: RequestHandler = async (req, res, next) => {
  try {
    const result = await carService.findAllCarsByEveryOneDB(req?.query);
    res.send(successResponse(result, 200, "Cars retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// const updateCar: RequestHandler = async (req, res, next) => {
//   try {
//     const result = await carService.updateCarDB(req.params.id, req.body);
//     res.send(successResponse(result, 200, "Car updated successfully"));
//   } catch (error) {
//     next(error);
//   }
// };
// const deleteCar: RequestHandler = async (req, res, next) => {
//   try {
//     const result = await carService.deleteCarDB(req.params.id);
//     res.send(successResponse(result, 200, "Car Deleted successfully"));
//   } catch (error) {
//     next(error);
//   }
// };

// const carReturn: RequestHandler = async (req, res, next) => {
//   try {
//     const result = await carService.carReturnDB(req.body);
//     res.send(successResponse(result, 200, "Car returned successfully"));
//   } catch (error) {
//     next(error);
//   }
// };
export const carController = {
  createCar,
  findOneCar,
  findAllCarsByAdmin,
  findAllCarsByEveryOne,
  // updateCar,
  // deleteCar,
  // carReturn,
};
