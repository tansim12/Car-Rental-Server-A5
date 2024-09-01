import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from 'body-parser';

const normalMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(cookieParser());
};
export default normalMiddleware;
