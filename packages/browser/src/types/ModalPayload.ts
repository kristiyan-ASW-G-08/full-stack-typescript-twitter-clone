export default interface ModalPayload {
  type?: 'text' | 'link' | 'retweet' | 'reply';
  replyId?: string;
  retweetedId?: string;
}
