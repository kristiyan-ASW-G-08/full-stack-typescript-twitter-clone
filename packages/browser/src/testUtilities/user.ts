import User from 'types/User';
import Logo from 'assets/logo-primary.svg';

const user: User = {
  username: 'username',
  handle: 'userHandle',
  email: 'mockUserEmail@mail.com',
  profilePhoto: 'default',
  headerPhoto: 'default',
  date: 'mockDate',
  website: 'mockWebsite',
  avatar: Logo,
  cover: Logo,
  followers: 0,
  following: [],
  likes: [],
  bookmarks: [],
  retweets: [],
  replies: [],
  _id: 'id',
};
export default user;
