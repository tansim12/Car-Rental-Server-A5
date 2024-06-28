import express from "express";
import validationMiddleWare from "../../middleware/ZodSchemaValidationMiddleware";
import { authMiddleWare } from "../../middleware/AuthMiddleWare";
import { USER_ROLE } from "../User/User.const";
import { bookingZodValidation } from "./Booking.zodValidation";
import { bookingsController } from "./Booking.Controller";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(USER_ROLE.user),
  validationMiddleWare(bookingZodValidation.bookingCreatingValidationSchemaZod),
  bookingsController.createBookings
);
// router.put(
//   "/:id",
//   authMiddleWare(USER_ROLE.admin),
//   validationMiddleWare(carZodValidation.carUpdateValidationSchemaZod),
//   carController.updateCar
// );
// router.delete("/:id", authMiddleWare(USER_ROLE.admin), carController.deleteCar);
router.get(
  "/",
  authMiddleWare(USER_ROLE.admin),
  bookingsController.findAllBookings
);
router.get(
  "/my-bookings",
  authMiddleWare(USER_ROLE.user),
  bookingsController.findOneMyBookings
);

export const bookingRoutes = router;
