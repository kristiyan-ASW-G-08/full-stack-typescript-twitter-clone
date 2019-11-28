import { Request, Response, NextFunction } from 'express';
import Validator from '@customTypes/Validator';
import { ValidationError } from 'yup';
import CustomValidationError from '@twtr/common/source/types/ValidationError';
import { errors, CustomError } from '@utilities/CustomError';

const validate = (
  validators: Validator[],
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      for await (const { schema, target } of validators) {
        const validationTarget = req[target];
        await schema.validate(validationTarget, {
          abortEarly: false,
        });
      }
      next();
    } catch (err) {
      const validationErrors = err.inner.map(
        ({ path, message }: ValidationError): CustomValidationError => {
          return { path, message };
        },
      );
      const { status, message } = errors.BadRequest;
      const error = new CustomError(status, message, validationErrors);
      next(error);
    }
  };
};
export default validate;
