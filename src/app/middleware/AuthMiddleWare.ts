import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../Error-Handle/AppError";
import httpStatus from "http-status";
import { UserModel } from "../Module/User/User.model";
import { TUserRole } from "../Module/User/User.interface";

dotenv.config();

const handleUnauthorizedError = (message: string, next: NextFunction) => {
  const error = new AppError(httpStatus.UNAUTHORIZED, message);
  next(error);
};

export const authMiddleWare = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return handleUnauthorizedError("You are not authorized !!!", next);
      }

      const decoded = jwt.verify(
        token as string,
        process.env.SECRET_ACCESS_TOKEN as string
      ) as JwtPayload;
      const { role, email } = decoded.data;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return next(new AppError(httpStatus.NOT_FOUND, "User not found"));
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return handleUnauthorizedError("You are not authorized !!!", next);
      }

      req.user = decoded.data;
      next();
    } catch (error) {
      return handleUnauthorizedError("You are not authorized !!!", next);
    }
  };
};
