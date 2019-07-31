import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import isAuth from '@customMiddleware/isAuth';

describe('isAuth', (): void => {
  it(`should add userId to req`, async (): Promise<void> => {
    // expect.assertions(2);
    const nextMock = jest.fn();
    const userId = 'randomUserId';
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        userId,
      },
      secret,
      { expiresIn: '1h' },
    );
    const reqMock = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resMock = httpMocks.createResponse();
    isAuth(reqMock, resMock, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(reqMock.userId).toEqual(userId);
  });
  it('should throw an error', async (): Promise<void> => {
    expect.assertions(1);
    const nextMock = jest.fn();
    const reqMock = httpMocks.createRequest({
      method: 'POST',
      url: '/',
    });
    const resMock = httpMocks.createResponse();
    expect((): void =>
      isAuth(reqMock, resMock, nextMock),
    ).toThrowErrorMatchingSnapshot();
  });
});
