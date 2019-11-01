import getSortString from '@utilities/getSortString';

type SortKey = 'top' | 'trending' | 'new' | 'replies';
type SortString = '-likes' | '-retweets' | '-date' | '-replies';

describe('getSortString', (): void => {
  const sortArr: { sortKey: SortKey; sortString: SortString }[] = [
    { sortKey: 'top', sortString: '-likes' },
    { sortKey: 'trending', sortString: '-retweets' },
    { sortKey: 'new', sortString: '-date' },
    { sortKey: 'replies', sortString: '-replies' },
  ];

  it.each(sortArr)(
    'should return the proper sort string',
    ({ sortKey, sortString }): void => {
      expect.assertions(1);
      expect(getSortString(sortKey)).toMatch(sortString);
    },
  );
});