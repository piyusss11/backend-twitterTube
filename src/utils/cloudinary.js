import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localeFilePath) => {
  try {
    if (!localeFilePath) return null;
    const response = await cloudinary.uploader.upload(localeFilePath, {
      resource_type: "auto",
    });
    // file uploaded
    console.log("file has succesfully uploaded", response.url);
    return response;
  } catch (error) {
    fs.unlink(localeFilePath); // remove the locally stored file after failing to upload
    return null;
  }
};

export { uploadOnCloudinary };
