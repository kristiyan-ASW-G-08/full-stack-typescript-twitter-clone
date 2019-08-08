export default interface Tweet {
  type: 'text' | 'link' | 'image';
  text: string;
  date: string;
  retweets: number;
  likes: number;
  comments: number;
  image: string;
  link: string;
}
