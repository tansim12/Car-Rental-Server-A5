import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const paymentDB = async (body: any, userId: string) => {
  console.log(body, userId);
  const formData = {
    cus_name: "tansim",
    cus_email: "tansim@gmail.com",
    cus_phone: "01849184000",
    amount: 500,
    tran_id: "54454751241gfgf1",
    signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
    // store_id: process.env.AAMAR_PAY_STORE_ID,
    store_id: "aamarpaytest",
    currency: "BDT",
    desc: "des",
    cus_add1: "53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    success_url: `${process.env.BASE_URL}api/payment/callback`,
    fail_url: `${process.env.BASE_URL}api/payment/callback`,
    cancel_url: `http://localhost:5173/`, // its redirect to frontend directly
    type: "json", //This is must required for JSON request
  };

  const { data } = await axios.post(
    `${process.env.AAMAR_PAY_HIT_API}`,
    formData
  );

  if (data.result !== "true") {
    let errorMessage = "";
    for (const key in data) {
      errorMessage += data[key] + ". ";
    }
    return errorMessage;
  }
  return data.payment_url;
};

const callbackDB = async (body: any) => {
  console.log(body);
};

export const paymentService = {
  paymentDB,
  callbackDB,
};
