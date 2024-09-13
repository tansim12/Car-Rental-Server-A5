/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import AppError from "../Error-Handle/AppError";
import dotenv from "dotenv";
import streamifier from "streamifier";
import { memoryStorage } from "./MemoryStorage";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SEC,
});

// Function to upload files to Cloudinary directly from memory
export const sendImagesToCloudinary = async (files: Express.Multer.File[]) => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: `image_${Date.now()}` },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      if (uploadResult) {
        uploadedUrls.push((uploadResult as any).secure_url);
      }
    } catch (error) {
      console.error(error);
      throw new AppError(400, "Cloudinary upload failed");
    }
  }

  return uploadedUrls; // Return an array of uploaded image URLs
};

// Use the custom memory storage for Multer
const storage = memoryStorage();

export const upload = multer({ storage });
