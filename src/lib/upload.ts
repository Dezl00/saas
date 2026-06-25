import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dw7senbmg',
  api_key: '158265941332155',
  api_secret: 'mBJcsqsgRlp9nuR0rMAquNp6E8s'
});
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

export async function uploadUrlToCloudinary(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      { folder: 'menura' },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          reject(error || new Error("Failed to upload URL to Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
}
