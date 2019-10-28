import httpMocks from 'node-mocks-http';
import paginate from '@customMiddleware/paginate';

type SortKey = 'top' | 'trending' | 'new' | 'replies';
type SortString = '-likes' | '-retweets' | '-date' | '-replies';

describe('paginate', (): void => {
  afterEach(() => jest.clearAllMocks());

  const sortArr: { sort: SortKey; sortString: SortString }[] = [
    { sort: 'top', sortString: '-likes' },
    { sort: 'trending', sortString: '-retweets' },
    { sort: 'new', sortString: '-date' },
    { sort: 'replies', sortString: '-replies' },
  ];
  const limitArr = [25, 30, 35, 40, 45, 50];

  it.each(sortArr)(
    'should return the proper sort string',
    ({ sort, sortString }): void => {
      expect.assertions(2);
      const nextMock = jest.fn();
      const reqMock = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        query: {
          sort,
        },
      });
      const resMock = httpMocks.createResponse();
      paginate(reqMock, resMock, nextMock);
      expect(nextMock).toBeCalledTimes(1);
      expect(reqMock.pagination).toEqual({
        limit: 25,
        page: 1,
        sort,
        sortString,
      });
    },
  );
  it.each(limitArr)('should return the proper limit', (limit: number): void => {
    expect.assertions(2);
    const nextMock = jest.fn();
    const reqMock = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      query: {
        limit,
      },
    });
    const resMock = httpMocks.createResponse();
    paginate(reqMock, resMock, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(reqMock.pagination).toEqual({
      limit,
      page: 1,
      sort: 'new',
      sortString: '-date',
    });
  });
});
