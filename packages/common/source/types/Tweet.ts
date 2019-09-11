export default interface Tweet {
  type: 'text' | 'link' | 'retweet' | 'reply';
  text: string;
  date: string;
  retweets: number;
  likes: number;
  replies: number;
  image: string;
  link: string;
  reply: string;
}
