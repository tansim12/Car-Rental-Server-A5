import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import AppError from "../Error-Handle/AppError";
import fs from "fs";
import dotEnv from "dotenv";
dotEnv.config();
import path from "path";

export const sendImageCloudinary = async (files: Express.Multer.File[]) => {
  // Configuration
  //   cloudinary.config({
  //     cloud_name: "dgm9w4vwh",
  //     api_key: process.env.CLOUD_API_KEY,
  //     api_secret: process?.env.CLOUD_SEC,
  //   });

  //   // Upload an image
  //   const uploadResult = await cloudinary.uploader
  //     //* path should be gets file path
  //     //* name your choice

  //     .upload(path, {
  //       public_id: name,
  //     })
  //     .catch((error) => {
  //       console.log(error);

  //       throw new AppError(400, "Cloudinary Something wrong");
  //     });
  //   if (uploadResult) {
  //     // when upload image , then delete file from uploads file
  //     try {
  //       fs.unlinkSync(path);
  //       //file removed
  //     } catch (err) {
  //       console.log(err);
  //       throw new AppError(400, "file Delete went wrong");
  //     }
  //     return uploadResult?.secure_url;

  const uploadedUrls = [];

  // Configuration
  cloudinary.config({
    cloud_name: "dgm9w4vwh",
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SEC,
  });

  for (const file of files) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: file.filename,
      });

      uploadedUrls.push(uploadResult.secure_url);

      // Delete the file from the uploads folder
      fs.unlinkSync(file.path);
    } catch (error) {
      console.log(error);
      throw new AppError(400, "Cloudinary upload error");
    }
  }

  return uploadedUrls;
  //   }
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     //* should be set folder name
//     cb(null, process.cwd() + "/uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage: storage }).array("images", 10);
