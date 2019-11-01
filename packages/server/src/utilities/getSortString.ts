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
  return sortStrings[sort] || '-date';
};

export default getSortString;
