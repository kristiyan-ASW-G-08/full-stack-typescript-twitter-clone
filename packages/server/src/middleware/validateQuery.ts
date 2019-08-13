import { Request, Response, NextFunction, Application } from 'express';
import { MixedSchema, ValidationError } from 'yup';
import CustomValidationError from '@twtr/common/source/types/ValidationError';
import { errors, CustomError } from '@utilities/CustomError';

const validateQuery = (
  validator: MixedSchema,
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let isError = false;
    try {
      const { query } = req;
      await validator.validate(query, {
        abortEarly: false,
      });
    } catch (err) {
      isError = true;
      const validationErrors = err.inner.map(
        (error: ValidationError): CustomValidationError => {
          const { path, message } = error;
          return { name: path, message };
        },
      );
      const { status, message } = errors.BadRequest;
      const error = new CustomError(status, message, validationErrors);
      next(error);
    } finally {
      if (!isError) next();
    }
  };
};
export default validateQuery;
