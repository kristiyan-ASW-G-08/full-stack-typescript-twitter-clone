type SortKey = 'top' | 'trending' | 'new' | 'replies';
type SortString = '-likes' | '-retweets' | '-date' | '-replies';

const getSortString = (sort: SortKey): SortString => {
  const sortStrings: {
    [key in SortKey]: SortString;
  } = {
    top: '-likes',
    trending: '-retweets',
    new: '-date',
    replies: '-replies',
  };
  const sortString = sortStrings[sort];
  return sortString || '-date';
};

export default getSortString;
