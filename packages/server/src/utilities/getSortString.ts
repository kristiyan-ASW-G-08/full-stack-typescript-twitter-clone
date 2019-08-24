const getSortString = (sort: string): string => {
  let sortString: string;
  switch (sort) {
    case 'top':
      sortString = '-likes';
      break;
    case 'trending':
      sortString = '-retweets';
      break;
    case 'new':
      sortString = '-date';
      break;
    case 'replies':
      sortString = '-replies';
      break;
    default:
      sortString = '-likes';
      break;
  }
  return sortString;
};

export default getSortString;
