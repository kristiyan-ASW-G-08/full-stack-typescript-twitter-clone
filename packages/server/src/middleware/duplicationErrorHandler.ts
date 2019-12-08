import { NextFunction } from 'express';
import { Document } from 'mongoose';
import RESTError, { errors } from '@utilities/RESTError';
import ValidationError from '@twtr/common/source/types/ValidationError';

const duplicationErrorHandler = (
  duplicationErrors: any,
  doc: Document,
  next: NextFunction,
): void => {
  if (duplicationErrors.errors) {
    const validationErrors: ValidationError[] = Object.values(
      duplicationErrors.errors,
    ).map(
      // @ts-ignore
      ({ value, path }: { value: string; path: string }): ValidationError => ({
        path,
        message: `${value} is already taken`,
      }),
    );
    const { status, message } = errors.Conflict;
    next(new RESTError(status, message, validationErrors));
  } else {
    next(duplicationErrors);
  }
};
export default duplicationErrorHandler;
