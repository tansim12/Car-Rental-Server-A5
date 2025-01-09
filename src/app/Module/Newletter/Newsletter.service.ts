/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../Error-Handle/AppError";
import { sendManyEmails } from "../../Utils/emailSender";
import NewsletterModel from "./Newsletter.model";

const createNewsLetterDB = async (payload: { email: string }) => {
  const isExist = await NewsletterModel.findOne({ email: payload?.email });
  if (isExist) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "this email already exist");
  }
  const result = await NewsletterModel.create(payload);
  return result;
};

const newLetterEmailSendDB = async (payload: any) => {
  const result = await sendManyEmails(
    payload?.emailArray,
    payload?.subject,
    payload?.message
  );

  return result;
};
const findAllNewsLetterEmailDB = async () => {
  const result = await NewsletterModel.find();

  return result;
};

export const newsLetterService = {
  newLetterEmailSendDB,
  createNewsLetterDB,
  findAllNewsLetterEmailDB,
};
