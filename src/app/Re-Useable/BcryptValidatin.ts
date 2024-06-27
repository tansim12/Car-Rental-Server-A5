import bcrypt from "bcrypt";
import AppError from "../Error-Handle/AppError";
import httpStatus from "http-status";

export const validateLoginPassword = async (
    plainTextPassword: string,
    hashPass: string
  ): Promise<boolean> => {
    try {
      const result = await bcrypt.compare(plainTextPassword, hashPass);
      return result;
    } catch (err) {
      throw new AppError(httpStatus.BAD_REQUEST, "Something Went Wrong !" );
    }
  };
