import user from './user';
import Tweet from 'types/Tweet';
const tweet: Tweet = {
  user,
  text: 'Text',
  link: 'mockLink',
  type: 'link',
  image: 'mockImage',
  _id: 'id',
  date: new Date(),
  likes: 0,
  retweets: 0,
  replies: 0,
  reply: {
    _id: 'id',
    user,
  },
};
export default tweet;
