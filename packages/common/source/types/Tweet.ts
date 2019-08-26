export default interface Tweet {
  type: 'text' | 'link' | 'image' | 'retweet';
  text: string;
  date: string;
  retweets: number;
  likes: number;
  replies: number;
  image: string;
  link: string;
}
