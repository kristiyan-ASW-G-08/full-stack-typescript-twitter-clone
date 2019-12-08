import multer from 'multer';
import { RESTError, errors } from '@utilities/RESTError';

const fileStorage = multer.diskStorage({
  // @ts-ignore
  destination: (_: Request, file, cb: (...args: any) => any): void => {
    console.log(typeof process.env.ALLOW_IMAGES);
    if (process.env.ALLOW_IMAGES === 'false') {
      const { message, status } = errors.UnprocessableEntity;
      const error = new RESTError(status, message);
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
