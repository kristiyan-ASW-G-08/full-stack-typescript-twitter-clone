import express, { Request, Response, NextFunction, Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';

import userRoutes from '@routes/userRoutes';

import { ErrorService, errors } from '@utilities/ErrorService';

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
app.use(userRoutes);
app.use(
  (
    error: ErrorService,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const status = error.status || 500;
    console.log(status);
    const { message } = error;
    const response = error.data ? { data: error.data, message } : { message };
    console.log(response);
    console.log('nani');
    res.status(status).json(response);
  },
);

export default app;
