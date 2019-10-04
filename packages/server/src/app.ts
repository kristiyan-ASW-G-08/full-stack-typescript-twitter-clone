import express, { Request, Response, NextFunction, Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import multer from 'multer';
import compression from 'compression';
import userRoutes from '@routes/userRoutes';
import tweetRoutes from '@routes/tweetRoutes';
import { CustomError } from '@utilities/CustomError';
import path from 'path';

const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const fileStorage = multer.diskStorage({
  // @ts-ignore
  destination: (req: Request, file, cb): any => {
    cb(null, './images');
  },
  filename: (req: Request, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`,
    );
  },
});

const fileFilter = (req: Request, file: any, cb: any): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/svg+xml'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/images', express.static('./images'));

app.use(userRoutes);
app.use(tweetRoutes);

app.use(
  (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    console.log(error);
    const status = error.status || 500;
    const { message } = error;
    const response = error.data ? { data: error.data, message } : { message };
    res.status(status).json(response);
  },
);

export default app;
