import { Types } from "mongoose";

export interface TBookings {
  car: Types.ObjectId;
  date: string;
  startTime: string;
  endTime?: string;
  user?: Types.ObjectId;
  totalCost?: number;
}
