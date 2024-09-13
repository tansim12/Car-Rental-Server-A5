import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { validateLoginPassword } from "../../Re-Useable/BcryptValidatin";
import { TUser } from "../User/User.interface";
import { UserModel } from "../User/User.model";
import { TChangePassword, TSignIn } from "./Auth.interface";
import { dynamicTokenGenerate } from "./Auth.utils";
import dotenv from "dotenv";
dotenv.config();
import { USER_STATUS } from "../User/User.const";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import Bcrypt from "bcrypt";

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

const refreshTokenDB = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !!!");
  }

  const decoded = jwt.verify(
    token as string,
    process.env.SECRET_REFRESH_TOKEN as string
  );

  // validation is exists
  const { id } = (decoded as JwtPayload).data;
  const { iat } = decoded as JwtPayload;

  const user = await UserModel.findById(id).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }

  // validate isExistsUserDeleted
  const isExistsUserDeleted = user?.isDelete;
  if (isExistsUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Deleted !");
  }

  const isExistsUserStatus = user?.status;
  if (isExistsUserStatus === USER_STATUS?.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Blocked !");
  }

  const passwordChangeConvertMilliSecond =
    new Date(user?.passwordChangeAt as Date).getTime() / 1000;
  const jwtIssueTime = iat as number;

  if (passwordChangeConvertMilliSecond > jwtIssueTime) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  // implements jwt token
  const jwtPayload = {
    id: user?._id,
    role: user?.role as string,
  };

  const accessToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_ACCESS_TOKEN as string,
    process.env.SECRET_ACCESS_TOKEN_TIME as string
  );

  return { accessToken };
};

const changePasswordDB = async (id: string, payload: TChangePassword) => {
  const { oldPassword, newPassword } = payload;

  // validation is exists
  const user = await UserModel.findById(id).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }
  // validate isExistsUserDeleted
  const isExistsUserDeleted = user?.isDelete;
  if (isExistsUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Deleted !");
  }
  const isExistsUserStatus = user?.status;
  if (isExistsUserStatus === USER_STATUS?.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Blocked !");
  }
  // check password is correct
  const checkPassword = await validateLoginPassword(
    oldPassword,
    user?.password
  );
  if (!checkPassword) {
    throw new AppError(
      400,
      "Old Password dose not matched... Try again letter 😥"
    );
  }
  // updating user model needPassword change false and password bcrypt
  let newPasswordBcrypt;
  if (checkPassword) {
    newPasswordBcrypt = await Bcrypt.hash(
      newPassword,
      Number(process.env.BCRYPT_NUMBER)
    );
  }
  if (!newPasswordBcrypt) {
    throw new AppError(400, "Password Not Change here");
  }
  const result = await UserModel.findByIdAndUpdate(id, {
    password: newPasswordBcrypt,
    passwordChangeAt: new Date(),
  });

  if (result) {
    return null;
  } else {
    throw new AppError(400, "Password Not Change here");
  }
};
const forgetPasswordDB = async (payload: TChangePassword) => {
  const { oldPassword, newPassword, email } = payload;

  // validation is exists
  const user = await UserModel.findOne({ email: email }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }
  // validate isExistsUserDeleted
  const isExistsUserDeleted = user?.isDelete;
  if (isExistsUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Already Deleted !");
  }
  const isExistsUserStatus = user?.status;
  if (isExistsUserStatus === USER_STATUS?.block) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Blocked !");
  }
  // check password is correct
  const checkPassword = await validateLoginPassword(
    oldPassword,
    user?.password
  );
  if (!checkPassword) {
    throw new AppError(
      400,
      "Old Password dose not matched... Try again letter 😥"
    );
  }
  // updating user model needPassword change false and password bcrypt
  let newPasswordBcrypt;
  if (checkPassword) {
    newPasswordBcrypt = await Bcrypt.hash(
      newPassword,
      Number(process.env.BCRYPT_NUMBER)
    );
  }
  if (!newPasswordBcrypt) {
    throw new AppError(400, "Password Not Change here");
  }
  const result = await UserModel.findByIdAndUpdate(
    { _id: user?._id },
    {
      password: newPasswordBcrypt,
      passwordChangeAt: new Date(),
    }
  );

  if (result) {
    return null;
  } else {
    throw new AppError(400, "Password Not Change here");
  }
};

export const authService = {
  signInDB,
  singUpDB,
  refreshTokenDB,
  changePasswordDB,
  forgetPasswordDB,
};
