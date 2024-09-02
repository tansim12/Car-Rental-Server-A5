import { Types } from "mongoose";

export interface TBookings {
  carId: Types.ObjectId;
  startDate: string;
  endDate: string;
  userId?: Types.ObjectId;
  orderCancel?: boolean;
  advancePayment?: number;
  totalCost?: number;
  deuPayment?: number;
  otp?: string;
  paymentStatus?: 0 | 1 | 2; // 0 is paymentStatus no approved  , 1 is when first advancePayment , 2 is deuPayment done
  adminApprove?: 0 | 1 |2;   // when paymentStatus 1  then  admin gets approve system. if admin status 1 then customer gets car ..  After customer returned car adminApprove 2  . 
}
