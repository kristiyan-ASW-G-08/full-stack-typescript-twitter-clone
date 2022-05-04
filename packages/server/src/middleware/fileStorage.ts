import multer from 'multer';
import { RESTError, errors } from '@utilities/RESTError';

const fileStorage = multer.diskStorage({
  // @ts-ignore
  destination: (_: Request, file, cb: (...args: any) => any): void => {
    if (process.env.ALLOW_IMAGES === 'false') {
      const { message, status } = errors.UnprocessableEntity;
      throw new RESTError(status, message);
    }
    cb(null, './images');
  },
  // @ts-ignore
  filename: (_: Request, file, cb: (...args: any) => any): void => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${
        file.originalname.split('.')[0]
      }`,
    );
  },
});

export default fileStorage;
