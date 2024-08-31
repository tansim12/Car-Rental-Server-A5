import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { authZodValidation } from "./Auth.ZodValidation";
import { authController } from "./Auth.controller";
import { UserZodValidation } from "../User/User.ZodValidation";

const router = express.Router();

router.post(
  "/signup",
  validationMiddleWare(UserZodValidation.userCreateValidationSchemaZod),
  authController.singUp
);

router.post(
  "/signin",
  validationMiddleWare(authZodValidation.signInValidationSchemaZod),
  authController.signIn
);

router.post(
  "/refresh-token",
  validationMiddleWare(authZodValidation.refreshTokenValidationSchemaZod),
  authController.refreshToken
);

export const authRoutes = router;
