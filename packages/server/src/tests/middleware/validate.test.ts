import httpMocks from 'node-mocks-http';
import validate from '@customMiddleware/validate';
import UserValidator from '@twtr/common/source/schemaValidators/UserValidator';
import ValidationError from '@twtr/common/source/types/ValidationError';
import { errors, CustomError } from '@utilities/CustomError';

describe('validate', (): void => {
  it(`should call next when a validation error occurs`, async (): Promise<
    void
  > => {
    expect.assertions(2);
    const username = 'a';
    const handle = 'testUserHandle';
    const email = 'notAnEmail';
    const password = 'testPassword';
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      body: {
        username,
        handle,
        email,
        password,
        confirmPassword: password,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const validateFunc = validate(UserValidator);
    const { status, message } = errors.BadRequest;
    const validationErrors: ValidationError[] = [
      { name: 'email', message: 'email must be a valid email' },
    ];
    const error = new CustomError(status, message, validationErrors);
    await validateFunc(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
  it("shouldn't call next when validation is successful", async (): Promise<
    void
  > => {
    expect.assertions(1);
    const username = 'testUser';
    const handle = 'testUserHandle';
    const email = 'testEmail@mail.com';
    const password = 'testPassword';
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      body: {
        username,
        handle,
        email,
        password,
        confirmPassword: password,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const validateFunc = validate(UserValidator);
    await validateFunc(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
