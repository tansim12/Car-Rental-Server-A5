/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendManyEmails } from "../../Utils/emailSender";

const newLetterEmailSendDB = async (payload: any) => {
  const result = await sendManyEmails(
    payload?.emailArray,
    payload?.subject,
    payload?.message
  );

  return result;
};

export const newsLetterService = {
  newLetterEmailSendDB,
};
