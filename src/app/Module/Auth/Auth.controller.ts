import { RequestHandler } from "express";
import { authService } from "./Auth.service";
import { successResponse } from "../../Re-Useable/CustomResponse";

const singUp:RequestHandler = async(req, res, next)=>{
  try {
      const result = await authService.singUpDB(req.body)
      res.status(201).send(successResponse(result,"User registered successfully"))
  } catch (error) {
      next(error)
  }
  }



const signIn: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.signInDB(req.body);
    res
      .status(200)
      .send(successResponse(result, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};

export const authController = {
  signIn,singUp
};
