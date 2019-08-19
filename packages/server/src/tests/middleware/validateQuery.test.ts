import httpMocks from 'node-mocks-http';
import validateQuery from '@customMiddleware/validateQuery';
import GetTweetsQueryValidator from '@twtr/common/source/schemaValidators/GetTweetsQueryValidator';
import ValidationError from '@twtr/common/source/types/ValidationError';
import { errors, CustomError } from '@utilities/CustomError';

describe('validateQuery', (): void => {
  it(`should call next when a validation error occurs`, async (): Promise<
    void
  > => {
    expect.assertions(1);
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      query: {
        limit: 100,
        page: 100,
        sort: 'invalid',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const validateQueryFunc = validateQuery(GetTweetsQueryValidator);
    await validateQueryFunc(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  it("shouldn't call next when validation is successful", async (): Promise<
    void
  > => {
    expect.assertions(1);
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      query: {
        limit: 25,
        page: 1,
        sort: 'top',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const validateQueryFunc = validateQuery(GetTweetsQueryValidator);
    await validateQueryFunc(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
