import { TGenericErrorResponse, TerrorSources } from "../Interface/error";
import mongoose from "mongoose";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {

  const errorSources: TerrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "CastError error",
    errorSources,
  };
};
export default handleCastError;
