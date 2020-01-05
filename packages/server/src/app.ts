import express, { Request, Response, NextFunction, Application } from 'express';

import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import userRoutes from 'src/users/routes';
import tweetRoutes from 'src/tweets/routes';
import errorHandler from '@customMiddleware/errorHandler';
import populateDB from '@utilities/populateDB';

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

// populateDB();
app.use(errorHandler);

export default app;
