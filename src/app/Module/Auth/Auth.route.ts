import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { authZodValidation } from "./Auth.ZodValidation";
import { authController } from "./Auth.controller";
import { UserZodValidation } from "../User/User.ZodValidation";
import { USER_ROLE } from "../User/User.const";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";

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
  "/password-change",
  authMiddleWare(USER_ROLE?.user, USER_ROLE.admin),
  validationMiddleWare(authZodValidation.changePasswordValidationSchemaZod),
  authController.changePassword
);
router.post(
  "/forget-password",
  validationMiddleWare(authZodValidation.changePasswordValidationSchemaZod),
  authController.forgetPassword
);
router.post(
  "/refresh-token",
  validationMiddleWare(authZodValidation.refreshTokenValidationSchemaZod),
  authController.refreshToken
);

export const authRoutes = router;
