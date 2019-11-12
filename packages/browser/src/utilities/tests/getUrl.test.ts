import getUrl from 'utilities/getUrl';

describe('getUrl', () => {
  const baseUrl = 'http://localhost:8090';
  const urls = ['/tweets', '/tweets/tweetId/replies', '/users'];
  it.each(urls)('should return a full url', extension => {
    expect(getUrl(extension)).toMatch(`${baseUrl}${extension}`);
  });
});
