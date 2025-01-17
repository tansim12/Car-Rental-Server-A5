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
router.get(
  "/",
  authMiddleWare(USER_ROLE.admin),
  newsLetterController.findAllNewsLetterEmail
);
router.post("/create", newsLetterController.createNewsLetter);

export const newsLetterRoutes = router;
