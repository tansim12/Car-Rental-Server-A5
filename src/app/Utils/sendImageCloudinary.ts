import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import AppError from "../Error-Handle/AppError";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config()

export const sendImagesToCloudinary = async (paths: string[]) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SEC,
  });

  const uploadedUrls: string[] = [];

  for (const path of paths) {
    try {
      // Upload each image
      const uploadResult = await cloudinary.uploader.upload(path, {
        public_id: `image_${Date.now()}`,
      });

      // If upload is successful, delete the file from the server
      if (uploadResult) {
        fs.unlinkSync(path);
        uploadedUrls.push(uploadResult.secure_url);
      }
    } catch (error) {
      console.log(error);
      throw new AppError(400, "Cloudinary upload or file deletion went wrong");
    }
  }

  return uploadedUrls; // Return an array of uploaded image URLs
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    //* should be set folder name  
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
