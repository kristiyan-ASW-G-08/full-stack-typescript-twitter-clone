import { FormikValues, FormikErrors } from 'formik';
import ValidationError from '@twtr/common/source/types/ValidationError';

const transformValidationErrors = (
  validationErrors: ValidationError[],
): FormikErrors<FormikValues> => {
  return validationErrors.reduce(
    (acc: { [key: string]: string }, { name, message }: ValidationError) => {
      return {
        ...acc,
        [name]: message,
      };
    },
    {},
  );
};

export default transformValidationErrors;
