import { Types } from "mongoose";

export interface TBookings {
  
  carId: Types.ObjectId;
  car?: Types.ObjectId;
  date: string;
  startTime: string;
  endTime?: string;
  user?: Types.ObjectId;
  totalCost?: number;
}
