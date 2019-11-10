import multer from 'multer';
import { CustomError, errors } from '@utilities/CustomError';

const fileStorage = multer.diskStorage({
  // @ts-ignore
  destination: (_: Request, file, cb: (...args: any) => any): void => {
    console.log(typeof process.env.ALLOW_IMAGES);
    if (process.env.ALLOW_IMAGES === 'false') {
      const { message, status } = errors.UnprocessableEntity;
      const error = new CustomError(status, message);
      throw error;
    }
    cb(null, './images');
  },
  // @ts-ignore
  filename: (_: Request, file, cb: (...args: any) => any): void => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`,
    );
  },
});

export default fileStorage;
