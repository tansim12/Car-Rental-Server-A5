import nodemailer from "nodemailer";
import dotenv from "dotenv";
import AppError from "../Error-Handle/AppError";
import httpStatus from "http-status";
dotenv.config();

export const emailSender = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: process.env.NODE_ENV === "production",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.USER_EMAIL, // sender address
    to, // list of receivers
    subject: "Car Ranter forget password within 5 mins!", // Subject line
    text: "Forget Password", // plain text body
    html, // html body
  });
};

export const sendManyEmails = async (
  emailArray: string[],
  subject: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Removed the extra period
      port: 587,
      secure: false, // Check this in production
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_APP_PASS,
      },
    });

    // Use Promise.all to send emails to all recipients concurrently
    await Promise.all(
      emailArray.map((email) =>
        transporter.sendMail({
          from: `"Car Rental" <${process.env.USER_EMAIL}>`,
          to: email, // recipient email address
          subject: subject,
          html, // HTML body content
        })
      )
    );
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to send emails");
  }
};
