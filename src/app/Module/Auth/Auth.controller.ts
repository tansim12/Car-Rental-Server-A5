import { RequestHandler } from "express";
import { authService } from "./Auth.service";
import { successResponse } from "../../Re-Useable/CustomResponse";

const singUp: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.singUpDB(req.body);
    const { accessToken, refreshToken } = result!;
    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
    res.send(
      successResponse({ accessToken }, 201, "User registered successfully")
    );
  } catch (error) {
    next(error);
  }
};

const signIn: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.signInDB(req.body);
    const { accessToken, refreshToken } = result!;
    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
    res.send(
      successResponse({ accessToken }, 200, "User logged in successfully")
    );
  } catch (error) {
    next(error);
  }
};

export const authController = {
  signIn,
  singUp,
};
