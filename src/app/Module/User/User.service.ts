import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { TUser } from "./User.interface";
import { UserModel } from "./User.model";
import { USER_ROLE, USER_STATUS, userSearchTerm } from "./User.const";
import QueryBuilder from "../../Builder/QueryBuilder";

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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Can not change Role or status!"
    );
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

const getSingleUserDB = async (tokenUserId: string, paramsUserId: string) => {
  const user = await UserModel.findById({ _id: tokenUserId }).select(
    "+password"
  );
  if (user?.role === USER_ROLE.user) {
    if (tokenUserId.toString() !== paramsUserId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You Can't find This User");
    }
  }
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This User Is Already Blocked !"
    );
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Is Already Delete !");
  }

  return user;
};
const findAllUserDB = async (
  tokenUserId: string,
  queryParams: Partial<TUser>
) => {
  const user = await UserModel.findById({ _id: tokenUserId }).select(
    "+password"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
  }
  if (user?.status === USER_STATUS.block) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This User Is Already Blocked !"
    );
  }
  if (user?.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This User Is Already Delete !");
  }
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You Can't Access This Route.Only Admin Access Here !"
    );
  }

  const queryUser = new QueryBuilder(UserModel.find(), queryParams)
    .filter()
    .paginate()
    .search(userSearchTerm)
    .sort()
    .fields();
  const result = await queryUser.modelQuery;

  const meta = await queryUser.countTotal();

  return { meta, result };
};

export const userService = {
  updateProfileDB,
  getSingleUserDB,
  findAllUserDB,
};
