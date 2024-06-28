import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { validateLoginPassword } from "../../Re-Useable/BcryptValidatin";
import { TUser } from "../User/User.interface";
import { UserModel } from "../User/User.model";
import { TSignIn } from "./Auth.interface";
import { dynamicTokenGenerate } from "./Auth.utils";
import dotenv from "dotenv";
dotenv.config();

const singUpDB = async (payload: Partial<TUser>) => {
  const user = await UserModel.findOne({ email: payload?.email }).select("email");
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Exists");
  }
  const result = await UserModel.create(payload);
  return result;
};

const signInDB = async (payload: TSignIn) => {
  const { email, password } = payload;
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    throw new AppError(404, "No Data Found");
  }
  const checkPassword = await validateLoginPassword(password, user?.password);
  if (!checkPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Password dose not matched !!"
    );
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_ACCESS_TOKEN as string,
    process.env.SECRET_ACCESS_TOKEN_TIME as string
  );
  if (!accessToken) {
    throw new AppError(httpStatus.CONFLICT, "Something Went Wrong !!");
  }

  return {
    user,
    accessToken,
  };
};

export const authService = {
  signInDB,
  singUpDB,
};
