import SortStringValidator from '@schemaValidators/SortStringValidator';

describe('SortStringValidator', (): void => {
  const limit = 25;
  const page = 1;
  it(`should validate successfully`, async (): Promise<void> => {
    const sort = 'top';
    const query = { page, limit, sort };
    await expect(SortStringValidator.validate(query)).resolves.toBe(query);
  });
  it(`should validate successfully`, async (): Promise<void> => {
    const sort = 'new';
    const query = { page, limit, sort };
    await expect(SortStringValidator.validate(query)).resolves.toBe(query);
  });
  it(`should validate successfully`, async (): Promise<void> => {
    const sort = 'comments';
    const query = { page, limit, sort };
    await expect(SortStringValidator.validate(query)).resolves.toBe(query);
  });
  it(`should validate successfully`, async (): Promise<void> => {
    const sort = 'trending';
    const query = { page, limit, sort };
    await expect(SortStringValidator.validate(query)).resolves.toBe(query);
  });
  it(`should throw an error`, async (): Promise<void> => {
    const sort = 'invalid';
    const query = { page: 0, limit: 0, sort };
    await expect(SortStringValidator.validate(query)).rejects.toMatchSnapshot();
  });
});
