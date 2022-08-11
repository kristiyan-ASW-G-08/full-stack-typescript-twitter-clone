import mongoose from 'mongoose';
import connectToDB from 'utilities/connectToDB';
import logger from 'utilities/logger';

jest.mock('mongoose');
jest.mock('utilities/logger');

const loggerMock = logger as jest.Mocked<typeof logger>;
const mongooseMock = mongoose as jest.Mocked<typeof mongoose>;
const mongoURI = 'mongoURL';
describe('connectToDB', (): void => {
  afterEach(() => jest.clearAllMocks());

  afterAll(() => jest.restoreAllMocks());
  afterAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
    },
  );
  it('should connect to mongodb', async () => {
    expect.assertions(4);

    await expect(connectToDB(mongoURI)).resolves.toBeUndefined();

    expect(mongooseMock.connect).toHaveBeenCalledTimes(1);
    expect(mongooseMock.connect).toHaveBeenCalledWith(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    expect(loggerMock.error).not.toHaveBeenCalled();
  });
  it('should not connect to mongodb', async () => {
    expect.assertions(4);

    mongooseMock.connect.mockRejectedValueOnce(new Error('Connection Error'));
    await expect(connectToDB(mongoURI)).resolves.toBeUndefined();

    expect(mongooseMock.connect).toHaveBeenCalledTimes(1);
    expect(mongooseMock.connect).toHaveBeenCalledWith(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    expect(loggerMock.error).toHaveBeenCalledTimes(1);
  });
});
