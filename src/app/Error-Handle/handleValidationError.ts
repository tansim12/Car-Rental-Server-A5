import { TGenericErrorResponse, TerrorSources } from "../Interface/error";
import mongoose from "mongoose";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TerrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.path,
        message: val.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation error",
    errorSources,
  };
};
export default handleValidationError;
