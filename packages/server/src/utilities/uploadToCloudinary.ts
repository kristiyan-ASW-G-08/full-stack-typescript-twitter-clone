import cloudinary from 'cloudinary';

const { CLOUD_NAME, CLOUDINARY_API_KEY, API_SECRET } = process.env;
// @ts-ignore
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: API_SECRET,
});

const uploadToCloudinary = async (
  path: string,
  filename: string,
): Promise<void> => {
  // @ts-ignore
  await cloudinary.uploader.upload(path, { public_id: filename });
};

export default uploadToCloudinary;
