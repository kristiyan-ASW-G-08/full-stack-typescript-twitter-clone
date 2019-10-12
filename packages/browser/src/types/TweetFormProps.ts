export default interface TweetFormProps {
  type?: 'text' | 'link' | 'retweet' | 'reply';
  replyId?: string;
  retweetedId?: string;
}
