import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { TUser } from "./User.interface";
import { UserModel } from "./User.model";
import { USER_ROLE, USER_STATUS } from "./User.const";

const updateProfileDB = async (
  id: string,
  body: Partial<TUser>,
  tokenGetsId: string,
  tokenGetsRole: string
) => {
  const user = await UserModel.findById(id).select("+password");
  const tokenIdByUser = await UserModel.findById({ _id: tokenGetsId }).select(
    "role status isDelete"
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Data Not Found !!");
  }
  if (user?.status === USER_STATUS.block && tokenGetsRole === USER_ROLE.user) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Blocked !!");
  }
  if (user?.isDelete && tokenGetsRole === USER_ROLE.user) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Already Delete !!");
  }

  if (
    (body?.role && tokenIdByUser?.role === USER_ROLE.user) ||
    (body?.status && tokenIdByUser?.role === USER_ROLE.user) ||
    tokenIdByUser?.status === USER_STATUS?.block ||
    tokenIdByUser?.isDelete === true
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your Can not change Role or status!");
  }

  if (body?.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Can not change password !"
    );
  }

  if (body?.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your Can not change email !");
  }

  if (tokenGetsRole === USER_ROLE.user && tokenGetsId.toString() !== id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your can't change Other user info"
    );
  }
  const result = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        ...body,
      },
    },
    { upsert: true, new: true }
  ).select("+password");
  return result;
};

export const userService = {
  updateProfileDB,
};
