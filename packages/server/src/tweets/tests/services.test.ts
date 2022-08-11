import { getTweetById } from 'src/tweets/services';
import Tweet from 'src/tweets/Tweet';
import getResource from 'utilities/getResource';

jest.mock('utilities/getResource');

const getResourceMock = getResource as jest.MockedFunction<typeof getResource>;
describe('getTweetById', () => {
  it(`should call getResource`, async () => {
    expect.assertions(2);
    const tweetId = 'tweetId';
    await getTweetById(tweetId);

    expect(getResource).toHaveBeenCalledTimes(1);
    expect(getResourceMock).toHaveBeenCalledWith(Tweet, {
      name: '_id',
      value: tweetId,
    });
  });
});
