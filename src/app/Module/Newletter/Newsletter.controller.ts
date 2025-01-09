import { RequestHandler } from "express";
import { successResponse } from "../../Re-Useable/CustomResponse";
import { newsLetterService } from "./Newsletter.service";

const newLetterEmailSend: RequestHandler = async (req, res, next) => {
  try {
    const result = await newsLetterService.newLetterEmailSendDB(req?.body);
    res.send(successResponse(result, 200, "Most booking car"));
  } catch (error) {
    next(error);
  }
};

export const newsLetterController = { newLetterEmailSend };
