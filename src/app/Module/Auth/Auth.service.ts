import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { validateLoginPassword } from "../../Re-Useable/BcryptValidatin";
import { TUser } from "../User/User.interface";
import { UserModel } from "../User/User.model";
import { TSignIn } from "./Auth.interface";
import { dynamicTokenGenerate } from "./Auth.utils";
import dotenv from "dotenv";
import { USER_STATUS } from "../User/User.const";
dotenv.config();

const singUpDB = async (payload: Partial<TUser>) => {
  const user = await UserModel.findOne({
    $or: [{ email: payload?.email }, { phone: payload?.phone }],
  }).select("email");
  if (user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This User Already Exists Change Email Or Phone Number"
    );
  }
  const result = await UserModel.create(payload);
  if (result) {
    const jwtPayload = {
      id: result?._id,
      role: result?.role as string,
    };

    const accessToken = dynamicTokenGenerate(
      jwtPayload,
      process.env.SECRET_ACCESS_TOKEN as string,
      process.env.SECRET_ACCESS_TOKEN_TIME as string
    );
    const refreshToken = dynamicTokenGenerate(
      jwtPayload,
      process.env.SECRET_REFRESH_TOKEN as string,
      process.env.SECRET_REFRESH_TOKEN_TIME as string
    );
    if (!accessToken) {
      throw new AppError(httpStatus.CONFLICT, "Something Went Wrong !!");
    }
    return {
      accessToken,
      refreshToken,
    };
  }
};

const signInDB = async (payload: TSignIn) => {
  const { email, password } = payload;
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    throw new AppError(404, "No Data Found");
  }
  const isDelete = user?.isDelete;
  if (isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Delete !");
  }
  const isBlock = user?.status;
  if (isBlock === USER_STATUS.block) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Blocked !");
  }
  const checkPassword = await validateLoginPassword(password, user?.password);
  if (!checkPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Password dose not matched !!"
    );
  }

  const jwtPayload = {
    id: user?._id,
    role: user?.role as string,
  };

  const accessToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_ACCESS_TOKEN as string,
    process.env.SECRET_ACCESS_TOKEN_TIME as string
  );
  const refreshToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_REFRESH_TOKEN as string,
    process.env.SECRET_REFRESH_TOKEN_TIME as string
  );
  if (!accessToken) {
    throw new AppError(httpStatus.CONFLICT, "Something Went Wrong !!");
  }

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  signInDB,
  singUpDB,
};
