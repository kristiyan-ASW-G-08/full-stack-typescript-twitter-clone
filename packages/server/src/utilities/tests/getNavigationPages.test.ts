import getNavigationPages from '@utilities/getNavigationPages';
import renderUrl from '@utilities/renderUrl';

jest.mock('@utilities/renderUrl');

interface Queries {
  [key: string]: string | number;
}
const renderUrlMock = renderUrl as jest.MockedFunction<typeof renderUrl>;

describe('getNavigationPages', () => {
  const sortArr: {
    count: number;
    page: number;
    urlExtension: string;
    queries: Queries;
    urlResult: string;
    prevPage: string | null;
    nextPage: string | null;
  }[] = [
    {
      count: 10,
      page: 1,
      urlExtension: 'tweets',
      queries: { limit: 25, page: 1, sort: 'top' },
      urlResult: `${process.env.SERVER_URL}/tweets?limit=25&page=1&sort=top`,
      prevPage: null,
      nextPage: `${process.env.SERVER_URL}/tweets?limit=25&page=2&sort=top`,
    },
    {
      count: 0,
      page: 10,
      urlExtension: 'users/tweets/tweetId',
      queries: { limit: 25, page: 1, sort: 'top' },
      urlResult: `${process.env.SERVER_URL}/users/tweets/tweetId`,
      prevPage: null,
      nextPage: null,
    },
  ];
  it.each(sortArr)(
    'should return the correct next and previous pages',
    ({ urlExtension, queries, prevPage, nextPage, count, page }): void => {
      expect.assertions(1);
      // @ts-ignore
      renderUrlMock.mockReturnValueOnce(nextPage).mockReturnValueOnce(prevPage);
      expect(
        getNavigationPages({ count, page, queries, urlExtension }),
      ).toStrictEqual({ nextPage, prevPage });
    },
  );
});
