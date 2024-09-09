import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { UserZodValidation } from "./User.ZodValidation";
import { USER_ROLE } from "./User.const";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { userController } from "./User.Controller";
const router = express.Router();

router.put(
  "/profile-update/:userId",
  authMiddleWare(USER_ROLE.admin, USER_ROLE.user),
  validationMiddleWare(UserZodValidation.userUpdateValidationSchemaZod),
  userController.updateProfile
);
router.get(
  "/:userId",
  authMiddleWare(USER_ROLE.admin, USER_ROLE.user),
  userController.getSingleUser
);
router.get("/", authMiddleWare(USER_ROLE.admin), userController.findAllUser);

export const userRoutes = router;
