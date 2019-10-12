import CommonUser from '@twtr/common/source/types/user';

export default interface User extends CommonUser {
  following: string[];
  likes: string[];
  bookmarks: string[];
  replies: string[];
  retweets: string[];
  avatar?: string;
  _id: string;
}
