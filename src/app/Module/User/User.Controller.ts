import { RequestHandler } from "express";
import { successResponse } from "../../Re-Useable/CustomResponse";
import httpStatus from "http-status";
import { userService } from "./User.service";
import AppError from "../../Error-Handle/AppError";

const updateProfile: RequestHandler = async (req, res, next) => {
  const tokenGetsId = req?.user?.id;
  const userId = req?.params?.userId;

  try {
    const result = await userService.updateProfileDB(
      userId,
      req?.body,
      tokenGetsId
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

export const userController = {
  updateProfile,
};
