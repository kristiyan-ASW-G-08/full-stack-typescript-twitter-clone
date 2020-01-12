import formErrorHandler from 'utilities/formErrorHandler';
import ValidationError from '@twtr/common/source/types/ValidationError';
import transformValidationErrors from 'utilities/transformValidationErrors';
import defaultWarning from 'utilities/defaultWarning';

jest.mock('utilities/transformValidationErrors');

// @ts-ignore
const transformValidationErrorsMock = transformValidationErrors as jest.MockedFunction<
  typeof transformValidationErrors
>;
const validationErrors: ValidationError[] = [
  { path: 'email', message: 'must be a valid email' },
  { path: 'password', message: 'must be at least 12 characters' },
];
const formikErrors = {
  email: validationErrors[0].message,
  password: validationErrors[1].message,
};
transformValidationErrorsMock.mockReturnValue(formikErrors);

describe('formErrorHandler', () => {
  const setErrors = jest.fn();
  const setNotification = jest.fn();
  afterEach(jest.clearAllMocks);
  afterAll(jest.resetAllMocks);
  it('should call transformValidationErrors and setError when error contains validation errors', () => {
    expect.assertions(5);

    const error = {
      response: {
        data: {
          data: validationErrors,
        },
      },
    };
    formErrorHandler(error, setErrors, setNotification);

    expect(transformValidationErrorsMock).toHaveBeenCalledTimes(1);
    expect(transformValidationErrorsMock).toHaveBeenCalledWith(
      validationErrors,
    );
    expect(setErrors).toHaveBeenCalledTimes(1);
    expect(setErrors).toHaveBeenCalledWith(formikErrors);

    expect(setNotification).not.toHaveBeenCalled();
  });
  it("should call setNotification when error doesn't contain validationErrors", () => {
    expect.assertions(4);

    const error = {};
    formErrorHandler(error, setErrors, setNotification);

    expect(transformValidationErrorsMock).not.toHaveBeenCalled();
    expect(setErrors).not.toHaveBeenCalled();

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(defaultWarning);
  });
});
