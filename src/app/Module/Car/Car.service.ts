import { TCar } from "./Car.interface";
import { CarModel } from "./Car.model";

const crateCarDB = async (payload: TCar) => {
  const result = await CarModel.create(payload);
  return result;
};

export const carService = {
  crateCarDB,
};
