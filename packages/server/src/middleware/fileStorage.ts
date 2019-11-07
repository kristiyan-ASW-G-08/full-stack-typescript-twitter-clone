import multer from 'multer';

const fileStorage = multer.diskStorage({
  // @ts-ignore
  destination: (_: Request, file, cb: (...args: any) => any): void => {
    cb(null, './images');
  },
  // @ts-ignore
  filename: (_: Request, file, cb: (...args: any) => any): void => {
    const { SERVER_URL } = process.env;
    cb(
      null,
      `${SERVER_URL}/${new Date().toISOString().replace(/:/g, '-')}-${
        file.originalname
      }`,
    );
  },
});

export default fileStorage;
