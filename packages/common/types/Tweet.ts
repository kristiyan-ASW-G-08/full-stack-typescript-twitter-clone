import User from './User';

export default interface Tweet {
  type: 'text' | 'image' | 'retweet';
  text: string;
  date: string;
  retweets: number;
  likes: number;
  comments: number;
}
