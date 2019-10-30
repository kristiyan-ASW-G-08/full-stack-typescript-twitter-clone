import transformValidationErrors from 'utilities/transformValidationErrors';
import ValidationError from '@twtr/common/source/types/ValidationError';

describe('transformValidationErrors', () => {
  it('transforms ValidationErrors to FormikErrors', () => {
    expect.assertions(1);
    const validationErrors: ValidationError[] = [
      { path: 'email', message: 'must be a valid email' },
      { path: 'password', message: 'must be at least 12 characters' },
    ];
    const errors = transformValidationErrors(validationErrors);

    expect(errors).toMatchSnapshot();
  });
});
