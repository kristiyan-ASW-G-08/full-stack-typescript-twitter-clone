import getSortString from '@utilities/getSortString';

describe('getSortString', (): void => {
  it(`should get a tweet`, (): void => {
    expect.assertions(1);
    const sort = 'top';
    const sortString = getSortString(sort);
    expect(sortString).toMatch('-likes');
  });

  it(`should get a tweet`, (): void => {
    expect.assertions(1);
    const sort = 'trending';
    const sortString = getSortString(sort);
    expect(sortString).toMatch('-retweets');
  });
  it(`should get a tweet`, (): void => {
    expect.assertions(1);
    const sort = 'new';
    const sortString = getSortString(sort);
    expect(sortString).toMatch('-date');
  });
  it(`should get a tweet`, (): void => {
    expect.assertions(1);
    const sort = 'replies';
    const sortString = getSortString(sort);
    expect(sortString).toMatch('-replies');
  });
});
