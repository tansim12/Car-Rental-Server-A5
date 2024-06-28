import express, { Application, Request, Response } from "express";
import globalErrorHandler from "../src/app/Error-Handle/globalErrorHandle";
import normalMiddleware from "../src/app/middleware/normalMiddleware";
import { authRoutes } from "./app/Module/Auth/Auth.route";
import { carRoutes } from "./app/Module/Car/Car.route";
import { bookingRoutes } from "./app/Module/Booking/Booking.route";
// import { userRoutes } from "./app/Module/User/User.route";

const app: Application = express();
normalMiddleware(app);

// "/api/";

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Level-2 setup ");
});

app.all("*", (req: Request, res: Response, next) => {
  const error = new Error(`Can't find ${req.url} on the server`);
  next(error);
});

// global error handle
app.use(globalErrorHandler);

export default app;
