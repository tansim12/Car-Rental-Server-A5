import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { TCar } from "./Car.interface";
import { CarModel } from "./Car.model";

const crateCarDB = async (payload: TCar) => {
  const result = await CarModel.create(payload);
  return result;
};
const findOneCarDB = async (id: string) => {
  const result = await CarModel.findById(id);
  if (result) {
    return result;
  } else {
    throw new AppError(404, "No Data Found !");
  }
};

const findAllCarsDB = async () => {
  const result = await CarModel.find();
  return result;
};

const updateCarDB = async (id: string, payload: Partial<TCar>) => {
  const { features, ...remaining } = payload;
  const isExists = await CarModel.findById(id);
  if (!isExists) {
    throw new AppError(404, "No Data Found !");
  }
  const updateData = {
    ...remaining,
    // ...(features && { $addToSet: { features: { $each: features } } }),
    ...(features && {$addToSet:{features:{$each:features}}})
  }
  const result = await CarModel.findByIdAndUpdate(id, updateData, {
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

export const carService = {
  crateCarDB,
  findAllCarsDB,
  findOneCarDB,
  updateCarDB
};