import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../Error-Handle/AppError";
import httpStatus from "http-status";
import { UserModel } from "../Module/User/User.model";
import { TUserRole } from "../Module/User/User.interface";
import { USER_STATUS } from "../Module/User/User.const";

dotenv.config();

const handleUnauthorizedError = (message: string, next: NextFunction) => {
  const error = new AppError(httpStatus.UNAUTHORIZED, message);
  next(error);
};

export const authMiddleWare = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return handleUnauthorizedError(
          "You have no access to this route",
          next
        );
      }

      const decoded = jwt.verify(
        token as string,
        process.env.SECRET_ACCESS_TOKEN as string
      ) as JwtPayload;
      const { role, id } = decoded.data;
      const user = await UserModel.findById(id).select("+password");

      if (!user) {
        return next(new AppError(httpStatus.NOT_FOUND, "User not found"));
      }
      if (user?.isDelete) {
        return next(new AppError(httpStatus.BAD_REQUEST, "This User Already Deleted !"))
      }

      if (user?.status === USER_STATUS.block) {
        return next(new AppError(httpStatus.BAD_REQUEST, "This User Blocked !"))
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return handleUnauthorizedError(
          "You have no access to this route",
          next
        );
      }
      const data = {
        id: user?._id,
        role: decoded?.data?.role,
      };
      req.user = data;
      next();
    } catch (error) {
      return handleUnauthorizedError("You have no access to this route", next);
    }
  };
};
