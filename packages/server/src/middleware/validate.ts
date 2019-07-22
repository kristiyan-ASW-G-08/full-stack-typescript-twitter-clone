import { Request, Response, NextFunction, Application } from 'express';
import { MixedSchema, ValidationError } from 'yup';
import CustomValidationError from '@twtr/common/types/ValidationError';
import { errors, ErrorService } from '@utilities/ErrorService';
const validate = (
  validator: MixedSchema,
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { body } = req;
      const validationResult = await validator.validate(body, {
        abortEarly: false,
      });
    } catch (err) {
      const validationErrors = err.inner.map(
        (error: ValidationError): CustomValidationError => {
          const { path, message } = error;
          return { name: path, message };
        },
      );
      const { status, message } = errors.BadRequest;
      const error = new ErrorService(status, message, validationErrors);
      next(error);
    }
  };
};
export default validate;
