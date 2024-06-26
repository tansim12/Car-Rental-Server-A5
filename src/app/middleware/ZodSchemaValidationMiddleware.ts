import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validationMiddleWare = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await zodSchema.parseAsync({
        body: req.body,
        cookies:req.cookies
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
export default validationMiddleWare;
