import findDocs from 'utilities/findDocs';
import User from 'users/User';
import UserType from 'customTypes/User';

describe('findDocs', (): void => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());
  it(`should call all countDocuments, find, sort, skip, and limit`, async () => {
    expect.assertions(9);
    const pagination = {
      page: 1,
      limit: 25,
      sortString: '-date',
      sort: 'new',
    };

    const limit = jest.fn();
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));
    const find = jest.fn(() => ({
      sort,
    }));
    const findQuery = { user: 'user' };

    jest
      .spyOn(User, 'countDocuments')
      // @ts-ignore
      .mockReturnValue({ find });

    await findDocs<UserType, { user: string }>({
      model: User,
      pagination,
      query: findQuery,
    });

    expect(User.countDocuments).toHaveBeenCalledTimes(2);

    expect(find).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledWith(findQuery);

    expect(sort).toHaveBeenCalledTimes(1);
    expect(sort).toHaveBeenCalledWith(pagination.sortString);

    expect(skip).toHaveBeenCalledTimes(1);
    expect(skip).toHaveBeenCalledWith((pagination.page - 1) * pagination.limit);

    expect(limit).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledWith(pagination.limit);
  });
});
