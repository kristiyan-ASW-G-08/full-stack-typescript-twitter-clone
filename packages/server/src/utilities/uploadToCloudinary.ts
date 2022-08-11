import cloudinary from 'cloudinary';
import RESTError, { errors } from './RESTError';

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
): Promise<{ public_id: string }> => {
  try {
    // @ts-ignore
    return await cloudinary.v2.uploader.upload(path, {
      public_id: filename,
      folder: 'twittclone',
    });
  } catch {
    const { status, message } = errors.InternalServerError;
    throw new RESTError(status, message);
  }
};

export default uploadToCloudinary;
