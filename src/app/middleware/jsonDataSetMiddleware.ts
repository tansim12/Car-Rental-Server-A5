import { RequestHandler } from "express";

export const jsonDataSetMiddleware: RequestHandler = (req, res, next) => {
  try {
    req.body = JSON.parse(req.body?.data);
    next();
  } catch (error) {
    next(error);
  }
};