import { Types } from "mongoose";

export type TPaymentInfo = {
  mer_txnid: string;
  cus_email: string;
  cus_phone: string;
  amount: number;
  payment_type: string;
  approval_code: string;
};

export interface TBookings {
  carId: Types.ObjectId;
  startDate: string;
  endDate: string;
  userId?: Types.ObjectId;
  orderCancel?: boolean;
  advancePayment?: number;
  rentalPricePerDay?: number;
  totalCost?: number;
  deuPayment?: number;
  otp?: string;
  isDelete?: boolean;
  advancePaymentInfo?: TPaymentInfo;
  deuPaymentInfo?: TPaymentInfo;
  paymentStatus?: 0 | 1 | 2; // 0 is paymentStatus no payment here  , 1 is when first advancePayment , 2 is deuPayment done
  adminApprove?: 0 | 1 | 2 | 3; // when paymentStatus 1  then  admin gets approve system. if admin status 1 then customer gets car ..  After customer returned car adminApprove 2. Admin  cancel one booking adminApprove 3
}
