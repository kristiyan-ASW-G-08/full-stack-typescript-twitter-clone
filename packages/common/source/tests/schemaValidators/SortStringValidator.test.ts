import SortStringValidator from '@schemaValidators/SortStringValidator';

describe('SortStringValidator', (): void => {
  const validQueries = [
    {
      limit: 25,
      page: 1,
      sort: 'top',
    },
    {
      limit: 5,
      page: 1,
      sort: 'new',
    },
    {
      limit: 15,
      page: 1,
      sort: 'trending',
    },
    {
      limit: 50,
      page: 100,
      sort: 'replies',
    },
  ];
  const invalidQueries = [
    {
      limit: 100000,
      page: -2,
      sort: 'other',
    },
    {
      limit: -100,
      page: 1,
      sort: 'some',
    },
    {
      limit: 100000000000,
      page: -100,
      sort: 'zeta',
    },
    {
      limit: 50,
      page: 100,
      sort: 'beta',
    },
  ];
  it.each(validQueries)('should validate successfully', async query => {
    await expect(
      SortStringValidator.validate(query, { abortEarly: false }),
    ).resolves.toBe(query);
  });
  it.each(invalidQueries)('should validate unsuccessfully', async query => {
    await expect(
      SortStringValidator.validate(query, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
