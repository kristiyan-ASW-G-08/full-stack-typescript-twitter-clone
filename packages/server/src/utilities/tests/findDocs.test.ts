import findDocs from '@utilities/findDocs';
import User from '@users/User';
import UserType from '@customTypes/User';

describe('findDocs', (): void => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());
  it(`should call all countDocuments, find, sort, skip, and limit`, async () => {
    expect.assertions(9);
    const pageNum = 1;
    const limitNum = 25;
    const sortStr = '-date';

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

    await findDocs<UserType, { user: string }>(
      User,
      pageNum,
      limitNum,
      sortStr,
      findQuery,
    );

    expect(User.countDocuments).toHaveBeenCalledTimes(2);

    expect(find).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledWith(findQuery);

    expect(sort).toHaveBeenCalledTimes(1);
    expect(sort).toHaveBeenCalledWith(sortStr);

    expect(skip).toHaveBeenCalledTimes(1);
    expect(skip).toHaveBeenCalledWith((pageNum - 1) * limitNum);

    expect(limit).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledWith(limitNum);
  });
});
