import express, { Request, Response, NextFunction, Application } from 'express';

import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import userRoutes from './users/routes';
import tweetRoutes from './tweets/routes';
import errorHandler from './middleware/errorHandler';
import populateDB from './utilities/populateDB';

const app: Application = express();
app.use(cors());
app.use(helmet());
app.use(compression());
//@ts-ignore
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type content-Type  Authorization',
  );
  res.setHeader('Access-Control-Allow-Headers', 'content-Type');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  next();
});

app.use('/images', express.static('./images'));

app.use(userRoutes);
app.use(tweetRoutes);

// populateDB();
app.use(errorHandler);

export default app;
