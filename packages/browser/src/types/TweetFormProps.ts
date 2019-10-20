import Tweet from 'types/Tweet';

export default interface TweetFormProps {
  type?: 'text' | 'link' | 'retweet' | 'reply';
  replyId?: string;
  retweetedId?: string;
  tweet?: Tweet;
}
