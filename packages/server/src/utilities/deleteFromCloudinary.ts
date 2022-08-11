import cloudinary from 'cloudinary';
import RESTError, { errors } from './RESTError';

const { CLOUD_NAME, CLOUDINARY_API_KEY, API_SECRET } = process.env;
// @ts-ignore
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: API_SECRET,
});
// @eslint/ignore
const deleteCloudinaryFile = async (public_id: string): Promise<void> => {
  try {
    // @ts-ignore
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.log(error);
    const { status, message } = errors.InternalServerError;
    throw new RESTError(status, message);
  }
};

export default deleteCloudinaryFile;
