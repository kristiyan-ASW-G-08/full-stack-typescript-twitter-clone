import renderUrl from '@utilities/renderUrl';

interface Queries {
  [key: string]: string | number;
}

describe('renderUrl', (): void => {
  const sortArr: {

    urlExtension: string;
    queries: Queries | undefined;
    urlResult: string;
  }[] = [
    {
      urlExtension: 'tweets',
      queries: { limit: 25, page: 1, sort: 'top' },
      urlResult: `${process.env.SERVER_URL}/tweets?limit=25&page=1&sort=top`,
    },
    {
      urlExtension: 'users/tweets/tweetId',
      queries: undefined,
      urlResult: `${process.env.SERVER_URL}/users/tweets/tweetId`,
    },
  ];

  it.each(sortArr)(
    'should return the correct url',
    ({ urlExtension, queries, urlResult }): void => {
      expect.assertions(1);
      expect(renderUrl(urlExtension, queries)).toMatch(urlResult);
    },
  );
});
