import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { UserZodValidation } from "./User.ZodValidation";
import { userController } from "./User.Controller";
const router = express.Router();

router.post(
  "/signup",
  validationMiddleWare(UserZodValidation.userCreateValidationSchemaZod),
  userController.createUser
);

export const userRoutes = router;
