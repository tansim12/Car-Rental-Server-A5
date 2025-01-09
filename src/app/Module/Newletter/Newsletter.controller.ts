import { RequestHandler } from "express";
import { successResponse } from "../../Re-Useable/CustomResponse";
import { newsLetterService } from "./Newsletter.service";

const newLetterEmailSend: RequestHandler = async (req, res, next) => {
  try {
    const result = await newsLetterService.newLetterEmailSendDB(req?.body);
    res.send(successResponse(result, 200, "Send email done"));
  } catch (error) {
    next(error);
  }
};
const createNewsLetter: RequestHandler = async (req, res, next) => {
  try {
    const result = await newsLetterService.createNewsLetterDB(req?.body);
    res.send(successResponse(result, 200, "Register done"));
  } catch (error) {
    next(error);
  }
};

export const newsLetterController = { newLetterEmailSend, createNewsLetter };
