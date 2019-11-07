import express, { Request, Response, NextFunction, Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import userRoutes from 'src/users/routes';
import tweetRoutes from 'src/tweets/routes';
import { CustomError } from '@utilities/CustomError';

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



app.use('/images', express.static('./images'));

app.use(userRoutes);
app.use(tweetRoutes);

app.use(
  (error: CustomError, req: Request, res: Response, _: NextFunction): void => {
    console.log(error);
    const status = error.status || 500;
    const { message } = error;
    const response = error.data ? { data: error.data, message } : { message };
    res.status(status).json(response);
  },
);

export default app;
