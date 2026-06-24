import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config is automatically loaded from process.env.CLOUDINARY_URL

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Convert buffer to Base64 string for Cloudinary upload
  const base64String = buffer.toString('base64');
  const dataUri = `data:${file.type};base64,${base64String}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataUri,
      { folder: 'menura' },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          reject(error || new Error("Failed to upload image"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
}
