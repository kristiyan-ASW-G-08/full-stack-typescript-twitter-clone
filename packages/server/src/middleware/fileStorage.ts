import multer from 'multer';

const fileStorage = multer.diskStorage({
  // @ts-ignore
  destination: (req: Request, file, cb: (...args: any) => any): void => {
    cb(null, './images');
  },
  // @ts-ignore
  filename: (req: Request, file, cb: (...args: any) => any): void => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`,
    );
  },
});

export default fileStorage;
