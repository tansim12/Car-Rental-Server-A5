import express from "express";
import { USER_ROLE } from "../User/User.const";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { paymentController } from "./Payment.controller";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { paymentZodValidation } from "./Payment.zodValidation";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(USER_ROLE?.admin, USER_ROLE.user),
  validationMiddleWare(paymentZodValidation.paymentZodSchema),
  paymentController.payment
);
router.post("/callback", paymentController.callback);

export const paymentRoutes = router;
