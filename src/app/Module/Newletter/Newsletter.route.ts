import express from "express";
import { USER_ROLE } from "../User/User.const";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { newsLetterController } from "./Newsletter.controller";

const router = express.Router();

router.post(
  "/",
  authMiddleWare(USER_ROLE.admin),
  newsLetterController.newLetterEmailSend
);

export const newsLetterRoutes = router;
