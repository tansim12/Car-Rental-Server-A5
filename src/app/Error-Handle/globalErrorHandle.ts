import { Request, Response } from "express";

const globalErrorHandler = (
  err: any | string,
  req: Request,
  res: Response,
  next: any,
) => {
  // format error
  res.status(500).send({
    message: err.message,
    errors: err.errors,
  });
  next();
};

export default globalErrorHandler;
