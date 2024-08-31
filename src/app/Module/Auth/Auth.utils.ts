import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Types } from "mongoose";
dotenv.config();

export const dynamicTokenGenerate = (
  jwtPayload: { id: Types.ObjectId; role: string },
  token: string,
  time: string
) => {
  return jwt.sign(
    {
      data: jwtPayload,
    },
    token as string,
    { expiresIn: time }
  );
};
