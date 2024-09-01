import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { carZodValidation } from "./Car.zodValidation";
import { carController } from "./Car.controller";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { USER_ROLE } from "../User/User.const";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(USER_ROLE.admin),
  validationMiddleWare(carZodValidation.createCarZodSchema),
  carController.createCar
);
// router.put(
//   "/return",
//   authMiddleWare(USER_ROLE.admin),
//   validationMiddleWare(carZodValidation.carReturnSchemaZod),
//   carController.carReturn
// );
// router.put(
//   "/:id",
//   authMiddleWare(USER_ROLE.admin),
//   validationMiddleWare(carZodValidation.carUpdateValidationSchemaZod),
//   carController.updateCar
// );
// router.delete("/:id", authMiddleWare(USER_ROLE.admin), carController.deleteCar);
// router.get("/", carController.findAllCars);
// router.get("/:id", carController.findOneCar);

export const carRoutes = router;
