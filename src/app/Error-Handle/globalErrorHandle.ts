import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { TerrorSources } from "../Interface/error";
import handleZodError from "./handleZodError";

import dotenv from "dotenv";
import handleValidationError from "./handleValidationError";
import handleCastError from "./handleCastError";
import handleDuplicateError from "./handleDuplicateError";
import AppError from "./AppError";
dotenv.config();

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong !";
  let errorSources: TerrorSources = [
    {
      path: "",
      message: "",
    },
  ];


  if (err instanceof ZodError) {
    const simplifyError = handleZodError(err);

    (statusCode = simplifyError?.statusCode);
      (message = simplifyError?.message);
      (errorSources = simplifyError?.errorSources);
  } else if (err?.name === "ValidationError") {
    const simplifyError = handleValidationError(err);

    (statusCode = simplifyError?.statusCode);
      (message = simplifyError?.message);
      (errorSources = simplifyError?.errorSources);
  }
  else if (err?.name === "CastError") {
    const simplifyError = handleCastError(err);
    (statusCode = simplifyError?.statusCode);
      (message = simplifyError?.message);
      (errorSources = simplifyError?.errorSources);
  }
  else if (err?.name === 'CastError') {
    const simplifyError = handleCastError(err);
    statusCode = simplifyError?.statusCode;
    message = simplifyError?.message;
    errorSources = simplifyError?.errorSources;
  }
  else if (err?.code === 11000) {
    const simplifyError = handleDuplicateError(err);
    (statusCode = simplifyError?.statusCode);
      (message = simplifyError?.message);
      (errorSources = simplifyError?.errorSources);
  }

  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;

