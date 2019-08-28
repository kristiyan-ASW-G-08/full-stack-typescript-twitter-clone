import httpMocks from 'node-mocks-http';
import Validator from '@customTypes/Validator';
import validate from '@customMiddleware/validate';
import UserSignUpValidator from '@twtr/common/source/schemaValidators/UserSignUpValidator';
import SortStringValidator from '@twtr/common/source/schemaValidators/SortStringValidator';

describe('validate', (): void => {
  it(`should call next when a validation error occurs`, async (): Promise<
    void
  > => {
    expect.assertions(1);
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
      query: {
        limit: 25,
        page: 25,
        sort: 'top',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const validators: Validator[] = [
      {
        schema: SortStringValidator,
        target: 'query',
      },
      {
        schema: UserSignUpValidator,
        target: 'body',
      },
    ];
    const validateFunc = validate(validators);
    await validateFunc(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  it(`should call next when a validation error occurs`, async (): Promise<
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
      query: {
        limit: 100,
        page: 100,
        sort: 'invalid',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const validators: Validator[] = [
      {
        schema: SortStringValidator,
        target: 'query',
      },
      {
        schema: UserSignUpValidator,
        target: 'body',
      },
    ];
    const validateFunc = validate(validators);
    await validateFunc(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
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
      query: {
        limit: 25,
        page: 25,
        sort: 'top',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const validators: Validator[] = [
      {
        schema: SortStringValidator,
        target: 'query',
      },
      {
        schema: UserSignUpValidator,
        target: 'body',
      },
    ];
    const validateFunc = validate(validators);
    await validateFunc(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
