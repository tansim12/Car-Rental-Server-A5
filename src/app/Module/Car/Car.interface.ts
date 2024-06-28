import { Types } from "mongoose";

export interface TCar {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  features: string[];
  pricePerHour: number;
  status?: "available" | "unavailable";
  isDeleted?: boolean;
}

export interface TCarReturn {
  bookingId: Types.ObjectId;
  endTime: string;
}
