import express from "express";
import { USER_ROLE } from "../User/User.const";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { paymentController } from "./Payment.controller";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(USER_ROLE?.admin, USER_ROLE.user),
  paymentController.payment
);
router.post("/callback", paymentController.callback);

export const paymentRoutes = router;
