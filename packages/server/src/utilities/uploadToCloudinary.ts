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
  base64EncodedImage: string,
): Promise<{ public_id: string }> => {
  try {
    // @ts-ignore
    return await cloudinary.v2.uploader.upload(base64EncodedImage, {
      public_id: base64EncodedImage.substr(base64EncodedImage.length - 100),
      folder: 'twittclone',
    });
  } catch {
    const { status, message } = errors.InternalServerError;
    throw new RESTError(status, message);
  }
};

export default uploadToCloudinary;
