import { RequestHandler } from "express";
import { successResponse } from "../../Re-Useable/CustomResponse";
import httpStatus from "http-status";
import { userService } from "./User.service";
const updateProfile: RequestHandler = async (req, res, next) => {
  const tokenGetsId = req?.user?.id;
  const userId = req?.params?.userId;

  try {
    const result = await userService.updateProfileDB(
      userId,
      req?.body,
      tokenGetsId,
      req.user?.role
    );
    res
      .status(201)
      .send(
        successResponse(result, httpStatus.OK, "User registered successfully")
      );
  } catch (error) {
    next(error);
  }
};
const getSingleUser: RequestHandler = async (req, res, next) => {
  const tokenGetsId = req?.user?.id;
  const userId = req?.params?.userId;

  try {
    const result = await userService.getSingleUserDB(tokenGetsId, userId);
    res
      .status(201)
      .send(
        successResponse(result, httpStatus.OK, "User Find Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};
const findAllUser: RequestHandler = async (req, res, next) => {
  const tokenGetsId = req?.user?.id;
  const query = req?.query;

  try {
    const result = await userService.findAllUserDB(tokenGetsId, query);
    res
      .status(201)
      .send(
        successResponse(
          result,
          httpStatus.OK,
          "All User Find Successfully Done"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const userController = {
  updateProfile,
  getSingleUser,
  findAllUser,
};
