import AppError from "../../Error-Handle/AppError";
import { TUser } from "../User/User.interface";
import { UserModel } from "../User/User.model";
import { TSignIn } from "./Auth.interface";

const singUpDB = async (payload: Partial<TUser>) => {
  const result = await UserModel.create(payload);
  return result;
};

const signInDB = async (payload: TSignIn) => {
  const { email, password } = payload;
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    throw new AppError(404, "No Data Found");
  }
};

export const authService = {
  signInDB,
  singUpDB,
};
