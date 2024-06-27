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

export const carService = {
  crateCarDB,
  findAllCarsDB,
  findOneCarDB,
};
