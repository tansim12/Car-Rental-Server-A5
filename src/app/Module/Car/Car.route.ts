import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { carZodValidation } from "./Car.zodValidation";
import { carController } from "./Car.controller";
const router = express.Router();

router.post(
  "/cars",
  validationMiddleWare(carZodValidation.carCreateValidationSchemaZod),
  carController.crateCar
);

export const carRoutes = router;
