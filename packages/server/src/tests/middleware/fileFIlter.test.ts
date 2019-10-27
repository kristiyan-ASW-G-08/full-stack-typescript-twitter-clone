import httpMocks from 'node-mocks-http';
import fileFilter from '@customMiddleware/fileFilter';

describe('fileFilter', (): void => {
  afterEach((): void => {
    jest.clearAllMocks();
  });
  const reqMock = httpMocks.createRequest({
    method: 'POST',
    url: '/',
  });

  const formats = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
  const unacceptableFormats = ['audio', 'application', 'text', 'video'];

  it.each(formats)('should call cb once with true', (format): void => {
    expect.assertions(2);
    const cb = jest.fn();
    fileFilter(reqMock, { mimetype: format }, cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(null, true);
  });
  it.each(unacceptableFormats)(
    'should call cb once with false',
    (format): void => {
      expect.assertions(2);
      const cb = jest.fn();
      fileFilter(reqMock, { mimetype: format }, cb);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith(null, false);
    },
  );
});
