import Tweet from 'types/Tweet';
import user from './user';

const tweet: Tweet = {
  user,
  text: 'Text',
  link: 'https://github.com/',
  type: 'link',
  image: {
    public_id: 'someId',
    url: 'someUrl',
  },
  _id: 'mockId',
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
