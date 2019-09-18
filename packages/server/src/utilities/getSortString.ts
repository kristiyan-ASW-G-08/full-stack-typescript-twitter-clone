type SortStringKey = 'top' | 'trending' | 'new' | 'replies';
type SortStringValue = '-likes' | '-retweets' | '-date' | '-replies';
const getSortString = (sort: SortStringKey): SortStringValue => {
  const sortStrings: {
    [key in SortStringKey]: SortStringValue;
  } = {
    top: '-likes',
    trending: '-retweets',
    new: '-date',
    replies: '-replies',
  };
  const sortString = sortStrings[sort];
  return sortString || '-likes';
};

export default getSortString;
