import renderUrl from '@utilities/renderUrl';

interface Queries {
  [key: string]: string | number;
}

describe('renderUrl', (): void => {
  const sortArr: {
    baseUrl: string;
    urlExtension: string;
    queries: Queries | undefined;
    urlResult: string;
  }[] = [
    {
      baseUrl: 'http://localhost:8090',
      urlExtension: 'tweets',
      queries: { limit: 25, page: 1, sort: 'top' },
      urlResult: `http://localhost:8090/tweets?limit=25&page=1&sort=top`,
    },
    {
      baseUrl: 'http://localhost:8090',
      urlExtension: 'users/tweets/tweetId',
      queries: undefined,
      urlResult: `http://localhost:8090/users/tweets/tweetId`,
    },
  ];

  it.each(sortArr)(
    'should return the correct url',
    ({ baseUrl, urlExtension, queries, urlResult }): void => {
      expect.assertions(1);
      expect(renderUrl(baseUrl, urlExtension, queries)).toMatch(urlResult);
    },
  );
});
