import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';
import Validator from '../types/Validator';
import CustomValidationError from '@twtr/common/source/types/ValidationError';
import { errors } from '../utilities/RESTError';

const validationHandler = (
  validators: Validator[],
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      for await (const { schema, target } of validators) {
        //@rs-ignore
        const validationTarget = req[target];
        await schema.validate(validationTarget, {
          abortEarly: false,
        });
      }
      next();
    } catch (err) {
      // @ts-ignore
      const validationErrors = err.inner.map(
        ({ path, message }: ValidationError): CustomValidationError => ({
          path,
          message,
        }),
      );
      const { status } = errors.BadRequest;
      res.status(status).json({ data: validationErrors });
    }
  };
};
export default validationHandler;
